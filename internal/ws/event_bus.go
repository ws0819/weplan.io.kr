package ws

import (
	"context"
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

// 애플리케이션에서 사용할 EventBus 인터페이스
type EventBus interface {
	Publish(ctx context.Context, ev Event) error
}

// Redis 를 쓰지 않을 때용 No-op 구현
type NoopEventBus struct{}

func (NoopEventBus) Publish(ctx context.Context, ev Event) error {
	return nil
}

// Redis 기반 EventBus 구현체
type RedisEventBus struct {
	client     *redis.Client
	hub        *HubManager
	instanceID string
	channel    string
}

func NewRedisEventBus(client *redis.Client, hub *HubManager) *RedisEventBus {
	return &RedisEventBus{
		client:     client,
		hub:        hub,
		instanceID: uuid.NewString(),
		channel:    "weplan:events",
	}
}

type redisEnvelope struct {
	InstanceID string `json:"instanceId"`
	Event      Event  `json:"event"`
}

func (b *RedisEventBus) Publish(ctx context.Context, ev Event) error {
	env := redisEnvelope{
		InstanceID: b.instanceID,
		Event:      ev,
	}
	data, err := json.Marshal(env)
	if err != nil {
		return err
	}
	return b.client.Publish(ctx, b.channel, data).Err()
}

// 모든 인스턴스에서 goroutine 으로 돌리는 Subscriber
func (b *RedisEventBus) StartSubscriber(ctx context.Context) {
	pubsub := b.client.Subscribe(ctx, b.channel)
	ch := pubsub.Channel()

	log.Println("[WS][Redis] subscriber started")

	for {
		select {
		case <-ctx.Done():
			_ = pubsub.Close()
			log.Println("[WS][Redis] subscriber stopped")
			return

		case msg, ok := <-ch:
			if !ok {
				log.Println("[WS][Redis] channel closed")
				return
			}

			var env redisEnvelope
			if err := json.Unmarshal([]byte(msg.Payload), &env); err != nil {
				log.Println("[WS][Redis] unmarshal error:", err)
				continue
			}

			// 내가 Publish 한 이벤트는 무시
			if env.InstanceID == b.instanceID {
				continue
			}

			if err := b.hub.BroadcastEvent(env.Event); err != nil {
				log.Println("[WS][Redis] broadcast error:", err)
			}
		}
	}
}
