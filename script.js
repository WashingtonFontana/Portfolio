const WHATSAPP_PHONE = '5532988134080';

document.documentElement.classList.remove('no-js');
document.body.classList.remove('is-loading');

const form = document.querySelector('#formulario');
const nome = document.querySelector('#nome');
const mensagem = document.querySelector('#mensagem');
const feedback = document.querySelector('#feedback-form');
const botaoSubmit = form?.querySelector('.botao-form');

const mensagensErro = {
    nome: 'Informe seu nome com pelo menos 2 caracteres.',
    mensagem: 'Descreva sua necessidade com pelo menos 10 caracteres.'
};

function setErro(campo, mensagemErro) {
    const erro = document.querySelector(`#erro-${campo.id}`);
    campo.setAttribute('aria-invalid', 'true');
    if (erro) {
        erro.textContent = mensagemErro;
    }
}

function limparErro(campo) {
    const erro = document.querySelector(`#erro-${campo.id}`);
    campo.removeAttribute('aria-invalid');
    if (erro) {
        erro.textContent = '';
    }
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    const minimo = Number(campo.getAttribute('minlength')) || 1;

    if (valor.length < minimo) {
        setErro(campo, mensagensErro[campo.id]);
        return false;
    }

    limparErro(campo);
    return true;
}

function montarMensagemWhatsApp() {
    const texto = [
        `Olá, Washington! Me chamo ${nome.value.trim()}.`,
        mensagem.value.trim(),
        'Vim pelo seu portfólio e gostaria de conversar.'
    ].join(' ');

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
}

function handleSubmit(event) {
    event.preventDefault();

    const nomeValido = validarCampo(nome);
    const mensagemValida = validarCampo(mensagem);

    if (!nomeValido || !mensagemValida) {
        feedback.textContent = 'Revise os campos destacados antes de enviar.';
        feedback.style.color = 'var(--erro)';
        return;
    }

    botaoSubmit.classList.add('is-sending');
    botaoSubmit.textContent = 'Abrindo WhatsApp...';
    feedback.textContent = 'Mensagem validada. Abrindo WhatsApp em uma nova aba.';
    feedback.style.color = 'var(--sucesso)';

    window.open(montarMensagemWhatsApp(), '_blank', 'noopener,noreferrer');

    window.setTimeout(() => {
        botaoSubmit.classList.remove('is-sending');
        botaoSubmit.textContent = 'Enviar pelo WhatsApp';
    }, 900);
}

if (form && nome && mensagem && feedback && botaoSubmit) {
    form.addEventListener('submit', handleSubmit);
    [nome, mensagem].forEach((campo) => {
        campo.addEventListener('input', () => validarCampo(campo));
    });
}

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('is-visible');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.16 });

document.querySelectorAll('.secao-observada').forEach((secao) => observador.observe(secao));

document.querySelectorAll('.projeto-media img').forEach((imagem) => {
    const container = imagem.closest('.projeto-media');

    const marcarCarregada = () => container?.classList.add('is-loaded');

    if (imagem.complete) {
        marcarCarregada();
    } else {
        imagem.addEventListener('load', marcarCarregada, { once: true });
        imagem.addEventListener('error', marcarCarregada, { once: true });
    }
});
