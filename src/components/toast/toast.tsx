import { useAppContext } from "../../context/AppContext"

export default function Toast() {
    const { toastOpen, toast } = useAppContext();
    return (

        <div className={`${toastOpen ? '' : 'ml-5 opacity-0'} transition-all duration-400 z-300 fixed pointer-events-none inset-0 flex p-4 pb-14 w-full min-h-screen justify-end items-end`} >
            <div className='p-3 pb-4 relative bg-zinc-900 rounded-sm w-full max-w-[300px] flex overflow-hidden'>
                <h1 className='text-lg'>{toast.message}</h1>
                <div className={`${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} absolute  h-full w-3 top-0 right-0`}></div>
                <div key={toast.message} className={`${toastOpen ? 'opacity-100' : 'opacity-0'} absolute bg-blue-500 h-1 w-0 bottom-0 left-0`}
                    style={{
                        animation: 'shrinkBar 4s linear forwards',
                        animationName: 'shrinkBar'
                    }}></div>
            </div>
        </div >

    )
}

