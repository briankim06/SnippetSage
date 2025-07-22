import { GalleryVerticalEnd } from "lucide-react"
import { Typewriter } from "react-simple-typewriter"
import { RegistrationForm } from "@/components/registration-form"

export default function SignUpPage() {

  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-screen overflow-hidden">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SnippetSage
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegistrationForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(120deg, #f8b195 0%, #f67280 20%, #c06c84 50%, #6c5b7b 70%, #355c7d 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientMove 20s ease infinite",
            filter: "blur(5px)",
            opacity: 0.95,
          }}
        />
         <div className="absolute top-80 left-[55%] -translate-x-1/2 z-10 text-white text-7xl font-mono text-center w-full px8">
          <Typewriter
            words={['SNIPPETSAGE.', 'REUSE.', 'REFACTOR.', 'REDEFINE.']}
            loop={false}
            cursor
            cursorStyle={<span className="slow-blink">|</span>}
            cursorBlinking={false}
            typeSpeed={120}
            deleteSpeed={110}
            delaySpeed={3500}
          />
        </div>
      </div>
    </div>
  )
}
