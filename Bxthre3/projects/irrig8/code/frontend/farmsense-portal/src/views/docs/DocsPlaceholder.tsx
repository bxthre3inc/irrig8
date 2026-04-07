export default function DocsPlaceholder({ title }: { title: string }) {
    return (
        <div className="p-8 text-slate-400">
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            <p className="text-sm border-l-2 border-indigo-500 pl-4 py-2 bg-indigo-500/5 rounded-r">
                Content for this section is being populated from the master documentation repository.
                Please refer to the technical specs for high-fidelity implementation details.
            </p>
        </div>
    );
}
