import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/> 
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Prompt&display=swap" rel="stylesheet"/>
        <link rel="shortcut icon" href="favicon.jpeg" type="image/x-icon" />
      </Head>
      <body>

      <header className="text-gray-600 body-font bg-white">
       
          <div className="container mx-auto flex p-5 flex-row items-center justify-between">
            <a href='/' className="flex sm:gap-4 flex-col sm:flex-row sm:items-center title-font font-medium text-gray-900 mb-4 md:mb-0">
              <div className='flex items-center'>
                {/* <span className="mr-3 text-xl font-bold">Kardia Kingdom</span> */}
                <img className='w-[12rem]' src="/logo.jpeg" alt=""/>
              </div>
              <div className='flex items-center gap-1 bg-gray-200 w-fit p-2 mt-2 rounded-lg'>
                <span className='text-sm text-slate-700'>Built on</span>
                <img className='w-5' src="/kai.png" alt="" />
              </div>
            </a>
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
              <a href='/' className="mr-5 hover:text-gray-900">Home</a>
              <a href='/market' className="mr-5 hover:text-gray-900">Marketplace</a>
              <a href='/kongs' className="mr-5 hover:text-gray-900">Holdings</a>
            </nav>
          </div>
        </header>

        <Main />
        <NextScript />

        <div className="top__bar w-full text-center bg-gray-200 py-2">
          <span>Made By Moto</span>
          </div>
      </body>
    </Html>
  )
}