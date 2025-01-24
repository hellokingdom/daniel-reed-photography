export function About() {
  return (
    <div className="fixed w-full h-full z-50 inset-0 pointer-events-none p-2 bg-white hidden">
      <div className="w-1/2 h-full flex flex-col justify-center items-start">
        <div className="text-sm">
          Designer & Photographer, MCR.{' '}
          <a href="mailto:hello@danielreed.photography">
            hello@danielreed.photography
          </a>
          ,{' '}
          <a href="https://www.instagram.com/danielreed.photography">
            Instagram
          </a>
          .
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col justify-center items-end">
        <div className="bg-blue-500 aspect-[394/524] w-[394px]"></div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-end">
        <div className="flex gap-x-4">
          <div>Daniel Reed</div>
          <a className=" pointer-events-auto cursor-pointer text-black/50">
            About
          </a>
        </div>
      </div>
    </div>
  )
}
