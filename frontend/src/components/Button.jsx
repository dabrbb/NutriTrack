export default function Button({
    children,
    onClick,
    variant = "primary",
    className = "",
    circle = false
}) {
    const baseStyles = "transition-all active:scale-[0.95] cursor-pointer flex items-center justify-center";

    const shapeStyles = circle
        ? "rounded-full p-2"
        : "py-4 rounded-2xl w-full font-bold text-lg mt-8 shadow-lg";

    const variants = {
        primary: "bg-[#00C950] hover:bg-[#00b347] text-white shadow-[#00C950]/30",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30",
        ghost: "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100 shadow-none"
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${shapeStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}