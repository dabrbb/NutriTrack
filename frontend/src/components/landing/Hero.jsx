export default function Hero({ onStart, onLogin }) {
    return (
        <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <h1 className="text-5xl font-extrabold text-[#1A1C1E] mb-6">Rastrea tu nutrición fácilmente</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg">Calcula calorías y macros con NutriTrack</p>
            <div className="flex space-x-4 mb-20">
                <button onClick={onStart} className="bg-[#00C950] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#00b347] transition-all text-lg cursor-pointer">
                    Comenzar
                </button>
                <button onClick={onLogin} className="bg-white text-gray-700 font-semibold px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-lg cursor-pointer">
                    Iniciar sesión
                </button>
            </div>
        </section>
    );
}