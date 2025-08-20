import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function GameButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]", // default styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
