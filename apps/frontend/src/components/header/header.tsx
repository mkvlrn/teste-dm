import { IconMedicalCrossCircle } from "@tabler/icons-react";

export function Header() {
  return (
    <div className="flex flex-row items-center h-full gap-2">
      <IconMedicalCrossCircle className="" color="red" size={32} />
      <h1 className="text-2xl font-black">aTestamento digital</h1>
    </div>
  );
}
