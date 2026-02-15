package ws

import (
	"context"

	"WEPLAN/internal/common"

	"go.uber.org/zap"
)

type EventContext struct {
	Ctx        context.Context
	Event      *Event
	Client     *Client
	HubManager *HubManager
}

type HandlerFunc func(*EventContext) error

type EventDispatcher struct {
	handlers map[EventType]HandlerFunc
}

func NewEventDispatcher() *EventDispatcher {
	return &EventDispatcher{
		handlers: make(map[EventType]HandlerFunc),
	}
}

func (d *EventDispatcher) Register(t EventType, h HandlerFunc) {
	d.handlers[t] = h
}

func (d *EventDispatcher) Dispatch(ctx *EventContext) error {
	common.L().Info("WS event received",
		zap.String("type", string(ctx.Event.Type)),
		zap.String("meetingId", ctx.Event.MeetingID),
	)

	h, ok := d.handlers[ctx.Event.Type]
	if !ok {
		common.L().Warn("WS handler not found",
			zap.String("type", string(ctx.Event.Type)),
			zap.String("meetingId", ctx.Event.MeetingID),
		)
		return nil
	}

	if err := h(ctx); err != nil {
		common.L().Error("WS handler error",
			zap.String("type", string(ctx.Event.Type)),
			zap.String("meetingId", ctx.Event.MeetingID),
			zap.Error(err),
		)
		return err
	}

	return nil
}
