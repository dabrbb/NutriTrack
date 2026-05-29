export default function Features() {
    const features = [
        { title: "Cálculo fácil de calorías", desc: "Calcula rápidamente calorías y macros para cualquier comida" },
        { title: "Rastrea la nutrición diaria", desc: "Monitorea tu ingesta diaria y mantente en el camino" },
        { title: "Gestiona tus productos alimenticios", desc: "Crea tu propia base de datos de alimentos favoritos" }
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto px-6 pb-20 -mt-20 mb-30">
            {features.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="bg-[#E6F9EE] p-4 rounded-xl mb-6">
                        <div className="w-8 h-8 text-[#00C950]">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
            ))}
        </div>
    );
}