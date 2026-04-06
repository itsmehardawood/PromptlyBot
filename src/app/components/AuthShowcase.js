import Image from "next/image";

const highlights = {
  en: ["Launch in minutes", "Multilingual chatbot", "One-line website embed"],
  ar: ["إطلاق خلال دقائق", "دعم متعدد اللغات", "كود تضمين بسطر واحد"],
};

export default function AuthShowcase({ locale = "en", title, subtitle }) {
  const isArabic = locale === "ar";
  const items = highlights[isArabic ? "ar" : "en"];

  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-slate-900 to-cyan-900" />
      <div className="absolute -left-24 -top-16 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 px-8 pb-16 pt-10 text-white xl:px-14">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="PromptlyBot logo" width={42} height={42} priority />
          <p className="text-xl font-semibold tracking-wide">PromptlyBot</p>
        </div>

        <div className="mt-20 max-w-lg">
          <h2 className={`text-4xl font-bold leading-tight xl:text-5xl ${isArabic ? "rtl" : "ltr"}`}>{title}</h2>
          <p className={`mt-5 text-base leading-7 text-cyan-100 xl:text-lg ${isArabic ? "rtl" : "ltr"}`}>
            {subtitle}
          </p>

          <div className="mt-10 space-y-3">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
                <span className="text-sm text-cyan-50">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
