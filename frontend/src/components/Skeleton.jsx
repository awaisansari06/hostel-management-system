const Skeleton = ({ className = "", variant = "rect", width, height }) => {
    const baseClasses = "animate-pulse bg-slate-700/50";

    const variants = {
        circle: "rounded-full",
        rect: "rounded-xl", // consistent with our card border radius
        text: "rounded h-4"
    };

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
