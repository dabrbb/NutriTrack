export default function AuthCard({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 font-sans">
            <div className="bg-white flex flex-col rounded-3xl shadow-2xl shadow-gray-200/50 
                            p-6 sm:p-10 w-full max-w-md relative overflow-hidden">

                <div className="absolute top-6 left-6 sm:left-10 w-16 h-1 bg-[#00C950] rounded"></div>

                <div className="mt-6 mb-8">
                    <h1 className="text-[#1A1C1E] text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        {subtitle}
                    </p>
                </div>

                {children}
            </div>
        </div>
    );
}