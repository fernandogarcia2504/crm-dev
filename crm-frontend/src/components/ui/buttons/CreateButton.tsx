import { Plus } from "lucide-react";

import Button from "../Button";

interface CreateButtonProps {
    title: string;
    onClick?: () => void;
}

export default function CreateButton({ title, onClick }: CreateButtonProps) {
    return (
        <Button onClick={onClick} icon={<Plus size={15} />}>
            {title}
        </Button>
    );
}
