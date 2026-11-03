import {
    Mail,
    Phone,
    MessageCircle,
    Link,
    Calendar,
    Presentation,
    MapPin,
    MoreHorizontal
} from "lucide-react";

type ActivityType =
    | "Correo"
    | "Llamada"
    | "WhatsApp"
    | "LinkedIn"
    | "Reunion"
    | "Demo"
    | "Visita"
    | "Otro";

interface ActivityCardProps {
    title: string;
    result: string;
    nextStep: string;
    date: string;
    type: ActivityType;
    isLast?: boolean;
}

const activityConfig = {
    Correo: {
        icon: Mail,
        color: "#3fbf86"
    },
    Llamada: {
        icon: Phone,
        color: "#5b74ff"
    },
    WhatsApp: {
        icon: MessageCircle,
        color: "#3fbf86"
    },
    LinkedIn: {
        icon: Link,
        color: "#4aa3e0"
    },
    Reunion: {
        icon: Calendar,
        color: "#9a7cf0"
    },
    Demo: {
        icon: Presentation,
        color: "#e0912f"
    },
    Visita: {
        icon: MapPin,
        color: "#e5484d"
    },
    Otro: {
        icon: MoreHorizontal,
        color: "#636b78"
    }
}

export default function ActivityCard({ title, nextStep, date, type, isLast=false}: ActivityCardProps) {

    const {icon: Icon, color} = activityConfig[type];

    return(
        <div className="w-full grid grid-cols-[3%_60%_25%_10%] px-3 items-center gap-2 cursor-pointer">

            <div className="flex flex-col items-center relative">
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: color }}
                >
                    <Icon size={18} />
                </div>

                {!isLast && (
                    <div
                        className="absolute top-9 left-1/2 -translate-x-1/2 w-0 h-10 border-l-2 border-dashed border-gray-500"
                    />
                )}

            </div>

            <div className="flex flex-col ">
                <p>{title}</p>
                <p className="text-sm text-[#9aa3b2]">{nextStep}</p>
            </div>

            <p className="text-sm text-[#9aa3b2]">{date}</p>

        </div>
    )
}
