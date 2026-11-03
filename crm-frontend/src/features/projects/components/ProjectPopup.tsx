import { Target, X } from 'lucide-react';

interface ProjectPopupsProps {
    onClose: () => void;
}

export default function ProjectPopup({onClose}: ProjectPopupsProps) {

    return(
        <form action="" onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#15171c]  flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Target />
                <p>Crear un proyecto</p>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Título</p>
                <input type="text" className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el título del proyecto..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nota</p>
                <input type="text" className="w-full h-24 rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa una nota..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Fecha inicio</p>
                    <input type="text" className="w-full rounded-md px-3 py-1 bg-[#1b1e24]" />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Fecha cierre</p>
                    <input type="text" className="w-full rounded-md px-3 py-1 bg-[#1b1e24]" />
                </div>
            </div>

            <div className="flex justify-center">
                <button className="w-1/3 bg-[#5b74ff] rounded-md px-2 py-1">Crear contacto</button>
            </div>
        </form>
    )
}