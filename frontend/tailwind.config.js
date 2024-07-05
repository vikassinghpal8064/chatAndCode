/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        'screen-11/12':'calc(91.666667vw - 16px)',
        'screen-10/12':'calc(83.333333vw - 16px)',
        'full-16':'calc(100% - 16px)',
        'full-32':'calc(100% - 32px)',
        '100':'50rem',
        '88':'22rem',
        '76':'19rem',
        '68':'17rem',
        '120':'30rem',
        '140':'35rem',
        '160':'40rem',
        '180':'45rem',
        '200':'50rem',
        'screen-7':'calc(100vw - 28px)',
        'screen-16':'calc(100vw - 16px)'
      },
      height:{
       'screen-40':'calc(100vh - 40px)',
       'screen-48':'calc(100vh - 48px)',
       'screen-56':'calc(100vh - 56px)',
       'screen-64':'calc(100vh - 64px)',
       'screen-72':'calc(100vh - 72px)',
       'screen-80':'calc(100vh - 80px)',
       'screen-88':'calc(100vh - 88px)',
       'screen-96':'calc(100vh - 96px)',
       'screen-104':'calc(100vh - 104px)',
       'screen-112':'calc(100vh - 112px)',
       'screen-120':'calc(100vh - 120px)',
       'screen-128':'calc(100vh - 128px)',
       'screen-136':'calc(100vh - 136px)',
       'screen-152':'calc(100vh - 152px)',
       'screen-160':'calc(100vh - 160px)',
       'screen-168':'calc(100vh - 168px)',
       'screen-176':'calc(100vh - 176px)',
       'screen-300':'calc(100vh - 300px)',
      },
      screens:{
        'xxs':'380px',
        'xms':'420px',
        'xs':'450px',
        's':'510px',
        'sm':'576px',
        'sd':'650px',
        'md':'768px',
        'ml':'900px',
        'lg':'992px',
        'xl':'1200px',
        '2xl':'1400px',
        '3xl':'1536px'
      },
      minHeight:{
        'screen-64':'calc(100vh - 64px)',
       'screen-72':'calc(100vh - 72px)',
       'screen-80':'calc(100vh - 80px)',
       'screen-128':'calc(100vh - 128px)',
       'screen-136':'calc(100vh - 136px)',
      },
      minWidth:{
        'screen-64':'calc(100vh - 64px)',
       'screen-72':'calc(100vh - 72px)',
       'screen-80':'calc(100vh - 80px)',
       'screen-128':'calc(100vh - 128px)',
      }
    },
  },
  plugins: [],
}


