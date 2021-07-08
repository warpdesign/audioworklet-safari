let audioStarted = false

const initAudio = async (twoModules = true) => {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    if (twoModules) {
        console.log('adding two different modules')
        await context.audioWorklet.addModule('src/processor1.js')
        await context.audioWorklet.addModule('src/processor2.js')
    } else {
        console.log('adding a single module that registers two processors')
        await context.audioWorklet.addModule('src/processors.js')
    }

    const oscillator = new OscillatorNode(context)

    const node1 = new AudioWorkletNode(context, 'processor1');

    const node2 = new AudioWorkletNode(context, 'processor2');

    oscillator.connect(node1)
    node1.connect(node2)
    node2.connect(context.destination)
    //connect(node1)
    // node1.connect(node2)
    // node2.connect(context.destination)
    oscillator.start()
}

window.onload = async () => {
    [start, start2].forEach((el, i) => el.addEventListener('click', async () => {
        try {
            if (!audioStarted) {
                await initAudio(!i)
            }
            audioStarted = true
        } catch(e) {
            console.error('Error during initAudio', e)
        }
    }))
}
