import { cva } from "class-variance-authority"
import { tw } from "../../utill/tw"
import type { ButtonHTMLAttributes } from "react"


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary',
  size: 'sm' | 'md'|'lg',
  className?:string
  type?: 'submit' |'button'
  disabled?: boolean
  children: React.ReactNode
  onClick?:() => void
}

export const ButtonVariants = cva(
  "flex-center font-semibold px-3 py-1 rounded-sm cursor-pointer duration-300 w-full",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-hover",
        secondary: "border-primary border-1 text-primary hover:bg-[#ddddf8]",
      },
      size: {
        sm: "h-7",
        md:"h-10",
        lg: "h-14",
      },
    },
  }
);

function Button({
  children,
  variant,
  size,
  className,
  type='button',
  disabled = false,
  onClick,
  ...props }: ButtonProps) {
  
  return (
    <button
      className={tw(ButtonVariants({ variant, size }),className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
export default Button