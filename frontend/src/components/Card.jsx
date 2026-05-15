export default function Card({ children, className = "" }) {
    return (
        <div className={`rounded-4xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-50 ${className}`}>
            {children}
        </div>
    );
}