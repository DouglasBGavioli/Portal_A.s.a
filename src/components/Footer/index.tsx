export default function Footer() {
  return (
    <footer className="flex h-[90px] w-full flex-col items-center justify-center gap-4 bg-[#eeeded] px-4 text-center">
      <h3 className="text-sm font-medium leading-6 text-[#7e7e7e] md:text-base">
        Copyright © Associação Santiaguense de Airsoft
      </h3>

      <p className="text-xs font-normal text-[#7e7e7e] md:text-sm">
        Desenvolvido por{" "}
        <a
          href="https://www.dbgdev.com.br/"
          rel="noopener noreferrer"
          target="_blank"
          className="text-brand-500 transition-colors hover:font-medium hover:text-[#0e3804]"
        >
          Douglas Biassi Gavioli
        </a>
      </p>
    </footer>
  );
}