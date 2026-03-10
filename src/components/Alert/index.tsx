import { ReactNode } from "react";

type AlertProps = {
  variant: "success" | "info" | "warning" | "error";
  children?: ReactNode;
  type?: "inline" | "toast";
  onClick?(): void;
};

const variantMap = {
  success: "bg-[#e7ebde] text-brand-600 border-[#72815e]",
  info: "bg-[#e9eefc] text-[#1f3d99] border-[#6f88d8]",
  warning: "bg-[#f8edd7] text-[#7a5311] border-[#d6a751]",
  error: "bg-[#f7dede] text-[#a54848] border-[#c95d5d]",
};

export function Alert({ children, variant = "info", type = "toast" }: AlertProps) {
  return (
    <div className={`z-10 flex w-full max-w-[500px] items-center gap-4 rounded-lg border px-4 py-3 ${variantMap[variant]} ${type === "toast" ? "fixed shadow-md" : "border-0"}`}>
      <div className="flex w-full flex-col gap-1">
        {children && (
          <div className="flex justify-center">
            <p className="text-sm font-semibold">{children}</p>
          </div>
        )}
      </div>
    </div>
  );
}

