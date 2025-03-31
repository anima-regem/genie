<script>
    import { fade, fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import { marked } from 'marked';

    let wish = '';
    let response = '';
    let formattedResponse = '';
    let loading = false;
    let smokeParticles = [];

    function createSmoke() {
        const particle = {
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 50 + 20,
            opacity: Math.random() * 0.5 + 0.1
        };
        smokeParticles = [...smokeParticles, particle];
        if (smokeParticles.length > 15) {
            smokeParticles = smokeParticles.slice(1);
        }
    }

    async function makeWish() {
        loading = true;
        const interval = setInterval(createSmoke, 200);
        try {
            const res = await fetch('/api/genie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wish })
            });
            const data = await res.json();
            response = data.response;
            formattedResponse = marked(response);
        } catch (error) {
            console.error('Error:', error);
            response = 'The genie is currently on vacation. Try again later!';
        }
        loading = false;
        clearInterval(interval);
        smokeParticles = [];
    }
</script>

<svelte:head>
    <title>Mischievous Genie</title>
    <meta name="description" content="A genie that finds loopholes in your wishes" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
</svelte:head>

<main>
    <div class="lamp">
        <div class="lamp-base"></div>
        <div class="lamp-neck"></div>
        <div class="lamp-head"></div>
    </div>

    <div class="container" in:fly={{ y: 50, duration: 1000, easing: backOut }}>
        <h1>🧞‍♂️ The Mischievous Genie</h1>
        <p class="subtitle">Make a wish... if you dare! I'll find the perfect way to ruin it.</p>
        
        <div class="wish-form">
            <div class="smoke-container">
                {#each smokeParticles as particle}
                    <div
                        class="smoke-particle"
                        style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px; opacity: {particle.opacity}"
                        transition:fade
                    ></div>
                {/each}
            </div>

            <textarea
                bind:value={wish}
                placeholder="Enter your wish here..."
                rows="4"
                class:loading
            ></textarea>

            <button 
                on:click={makeWish} 
                disabled={loading || !wish}
                class:loading
            >
                <span class="button-content">
                    {#if loading}
                        <span class="loading-text">✨ Working magic...</span>
                    {:else}
                        <span class="wish-text">🎯 Make Wish</span>
                    {/if}
                </span>
            </button>
        </div>

        {#if response}
            <div class="response" in:fly={{ y: 20, duration: 800, easing: backOut }}>
                <h2>Your Twisted Wish:</h2>
                <div class="markdown-content">{@html formattedResponse}</div>
            </div>
        {/if}
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        overflow-x: hidden;
    }

    main {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        color: #fff;
        padding: 2rem;
        position: relative;
        overflow: hidden;
    }

    .lamp {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
    }

    .lamp-base {
        width: 60px;
        height: 20px;
        background: #d4af37;
        border-radius: 0 0 10px 10px;
        position: relative;
    }

    .lamp-neck {
        width: 10px;
        height: 40px;
        background: #d4af37;
        margin: 0 auto;
    }

    .lamp-head {
        width: 40px;
        height: 40px;
        background: #d4af37;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        box-shadow: 0 0 50px #ffd700;
    }

    .container {
        max-width: 800px;
        margin: 4rem auto 0;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 2;
    }

    h1 {
        font-family: 'Playfair Display', serif;
        text-align: center;
        font-size: 3rem;
        margin-bottom: 1rem;
        background: linear-gradient(to right, #ffd700, #FFA500);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .subtitle {
        text-align: center;
        margin-bottom: 3rem;
        font-size: 1.2rem;
        color: #b8c6db;
        font-weight: 300;
    }

    .wish-form {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .smoke-container {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .smoke-particle {
        position: absolute;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }

    textarea {
        width: 100%;
        padding: 1.5rem;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        font-size: 1.1rem;
        resize: vertical;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
    }

    textarea:focus {
        outline: none;
        border-color: #ffd700;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
    }

    textarea::placeholder {
        color: rgba(255, 255, 255, 0.3);
    }

    textarea.loading {
        opacity: 0.7;
    }

    button {
        padding: 1.2rem 2.5rem;
        background: linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%);
        border: none;
        border-radius: 1rem;
        color: #fff;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(110, 72, 170, 0.4);
    }

    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(110, 72, 170, 0.6);
        background: linear-gradient(135deg, #B066D4 0%, #7E58BA 100%);
    }

    button:disabled {
        background: #2c3e50;
        cursor: not-allowed;
        opacity: 0.7;
        box-shadow: none;
    }

    .button-content {
        display: inline-block;
        position: relative;
        z-index: 1;
    }

    .loading-text {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }

    .response {
        padding: 2rem;
        background: rgba(255, 255, 255, 0.07);
        border-radius: 1rem;
        border: 1px solid rgba(255, 215, 0, 0.2);
        margin-top: 2rem;
    }

    .response h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
        color: #ffd700;
        font-family: 'Playfair Display', serif;
    }

    .markdown-content {
        line-height: 1.6;
        color: #e6e6e6;
    }
    
    .markdown-content :global(p) {
        margin-bottom: 1rem;
    }
    
    .markdown-content :global(strong) {
        color: #b39ddb;
        font-weight: 600;
    }
    
    .markdown-content :global(em) {
        color: #aea1ff;
        font-style: italic;
    }
    
    .markdown-content :global(h1),
    .markdown-content :global(h2),
    .markdown-content :global(h3),
    .markdown-content :global(h4) {
        color: #ffd700;
        margin: 1rem 0;
        font-family: 'Playfair Display', serif;
    }
    
    .markdown-content :global(ul),
    .markdown-content :global(ol) {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .markdown-content :global(code) {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 0.3rem;
        font-family: monospace;
        color: #ffcc80;
    }
    
    .markdown-content :global(blockquote) {
        border-left: 3px solid #9D50BB;
        padding-left: 1rem;
        margin-left: 0;
        color: #b8c6db;
        font-style: italic;
    }

    @media (max-width: 768px) {
        .container {
            padding: 2rem;
            margin: 2rem auto 0;
        }

        h1 {
            font-size: 2.2rem;
        }

        .subtitle {
            font-size: 1rem;
        }
    }
</style>
