import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'


interface newNoteCardPrps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null


export function NewNoteCard({ onNoteCreated }: newNoteCardPrps) {

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)


    function handlerStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        if (content != "") {

            onNoteCreated(content)
            setShouldShowOnboarding(true)
            toast.success('Nota criada com sucesso')
        }
    }

    function handleStartRecording() {

        const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvaliable) {
            alert("Infelizmente seu navegador não suporta a API de gravação")
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()
        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true /* Faz com que a gravação contineu até você informa que ela deve parar */
        speechRecognition.maxAlternatives = 1 /* Faz com que traga apenas uma alternativa*/
        speechRecognition.interimResults = true /* Faz com que enquanot a gente fala ele retorna o que for entendendo*/

        speechRecognition.start()

        speechRecognition.onresult = (event) => {
            const transcprition = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, " ")

            setContent(transcprition)
        }

        speechRecognition.onerror = (event) => {
            console.log(event.error)
        }

    }

    function stopRecording() {
        setIsRecording(false)

        if (speechRecognition != null) {
            speechRecognition.stop()
        }
    }


    return (
        <Dialog.Root>

            <Dialog.Trigger className="bg-slate-600 flex flex-col text-left rounded-md p-5 gap-3 outline-none  hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-red-300">
                <span className="text-slate-200 font-medium text-sm">
                    Adicionar nota
                </span>
                <p className="text-slate-400 text-sm leading-6">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>

            </Dialog.Trigger>

            <Dialog.Portal> {/* Encaminhar o conteudo pra raiz do HTML*/}
                <Dialog.Overlay className='inset-0 fixed bg-black/50' /> {/* Criar o efeito do modal, escurecer a tela*/}

                <Dialog.Content className='fixed overflow-hidden inset-0 bottom-[10vh] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400'>
                        <X className='size-5 hover:text-slate-100' />
                    </Dialog.Close>

                    <form className='flex flex-col flex-1'>

                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className="text-slate-300 font-medium text-sm">
                                Adicionar nota
                            </span>

                            {shouldShowOnboarding ? (
                                <p className="text-slate-400 text-sm leading-6">
                                    Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handlerStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                </p>
                            ) :
                                (
                                    <textarea
                                        autoFocus
                                        className='resize-none bg-transparent outline-none flex-1 text-slate-400 text-sm'
                                        onChange={handleContentChanged}
                                        value={content}

                                    />
                                )}
                        </div>
                        {isRecording ? (
                            <button onClick={stopRecording} type='button'
                                className='bg-slate-900 flex items-center justify-center gap-2 text-sm text-center w-full py-3 text-slate-300 outline-none font-medium hover:text-slate-100'>

                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravando ! (Clique p/ interromper)
                            </button>
                        ) : (
                            <button type="button" onClick={handleSaveNote}
                                className='bg-lime-400 text-sm text-center w-full py-3 text-lime-950 outline-none font-medium hover:bg-lime-500'>
                                Salvar nota
                            </button>
                        )}

                    </form>


                </Dialog.Content>
            </Dialog.Portal >
        </Dialog.Root>
    )
}