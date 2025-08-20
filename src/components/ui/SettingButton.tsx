import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function SettingButton({
    className,
    disabled = false, // default is false | this decides the variant of the button
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            disabled={disabled}
            className={clsx(
                "w-full sm:w-[45%] py-4 text-white text-[30px] rounded transition-colors",
                disabled
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700",
                className
            )}
            {...props}
        />
    );
}
