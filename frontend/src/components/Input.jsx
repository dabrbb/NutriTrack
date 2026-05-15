export default function Input({ label, type, placeholder, onChange, value }) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <label className="text-sm font-bold text-[#49454F] ml-1">
                {label}
            </label>
            <input
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className="rounded-2xl border border-gray-200 bg-white p-4 text-gray-700 outline-none 
                   focus:ring-2 focus:ring-[#00C950]/20 focus:border-[#00C950] 
                   transition-all placeholder:text-gray-300 w-full"
            />
        </div>
    );
}