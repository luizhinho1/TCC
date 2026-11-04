"use strict";

/* ==========================================
   L.A. JARDINAGEM
   CONFIGURAÇÃO DA AGENDA
   ========================================== */

/* ALTERE AQUI:
   Horários oferecidos em cada dia disponível */

const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00"
];

/* ALTERE AQUI:
   Dias da semana com atendimento

   0 = domingo
   1 = segunda
   2 = terça
   3 = quarta
   4 = quinta
   5 = sexta
   6 = sábado
*/

const diasDisponiveis = [
    1,
    2,
    3,
    4,
    5,
    6
];

/* ALTERE AQUI:
   Datas bloqueadas */

const diasBloqueados = [
    "2026-12-25",
    "2027-01-01"
];

/* ALTERE AQUI:
   Horários bloqueados em datas específicas */

const horariosBloqueados = {

    "2026-10-15": [
        "08:00",
        "09:00"
    ]

};

/* ALTERE AQUI:
   Serviços da L.A. Jardinagem */

const servicosAgenda = [

    "Manutenção de jardins",

    "Poda de árvores e plantas",

    "Plantio",

    "Limpeza e revitalização",

    "Jardinagem residencial",

    "Jardinagem comercial"

];

/* ==========================================
   ALTERE AQUI:
   WHATSAPP DA EMPRESA
   ========================================== */

/*
   Somente números.

   Exemplo:
   5511999999999
*/

const numeroWhatsApp =
    "[SEU NÚMERO]";

/* ==========================================
   FUNÇÕES AUXILIARES
   ========================================== */

const $ = (id) =>
    document.getElementById(id);

const pad = (n) =>
    String(n).padStart(
        2,
        "0"
    );

const chaveData = (d) =>
    `${d.getFullYear()}-${pad(
        d.getMonth() + 1
    )}-${pad(
        d.getDate()
    )}`;

function mostrarMsg(
    el,
    texto,
    tipo = ""
) {

    if (!el) {
        return;
    }

    el.textContent =
        texto;

    el.className =
        "form__msg";

    if (tipo) {

        el.classList.add(
            tipo
        );

    }

}

/* ==========================================
   MENU HAMBÚRGUER
   ========================================== */

const botaoMenu =
    $("menuToggle");

const menu =
    $("menu");

function alternarMenu(
    abrir
) {

    menu.classList.toggle(
        "aberto",
        abrir
    );

    botaoMenu.classList.toggle(
        "ativo",
        abrir
    );

    botaoMenu.setAttribute(
        "aria-expanded",
        String(
            abrir
        )
    );

}

botaoMenu.addEventListener(
    "click",
    () => {

        alternarMenu(
            !menu.classList.contains(
                "aberto"
            )
        );

    }
);

menu
    .querySelectorAll("a")
    .forEach(
        (a) => {

            a.addEventListener(
                "click",
                () => {

                    alternarMenu(
                        false
                    );

                }
            );

        }
    );

/* ==========================================
   GALERIA + LIGHTBOX
   ========================================== */

const lightbox =
    $("lightbox");

const lightboxImg =
    $("lightboxImg");

function abrirLightbox(
    src
) {

    lightboxImg.src =
        src;

    lightbox.hidden =
        false;

    $("lightboxFechar")
        .focus();

}

function fecharLightbox() {

    lightbox.hidden =
        true;

    lightboxImg.src =
        "";

}

document
    .querySelectorAll(
        ".galeria__item"
    )
    .forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    abrirLightbox(
                        item.dataset.src
                    );

                }
            );

        }
    );

$("lightboxFechar")
    .addEventListener(
        "click",
        fecharLightbox
    );

lightbox.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            lightbox
        ) {

            fecharLightbox();

        }

    }
);

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Escape" &&
            !lightbox.hidden
        ) {

            fecharLightbox();

        }

    }
);

/* ==========================================
   FLUXO DE SOLICITAÇÃO
   ========================================== */

const hoje =
    new Date();

hoje.setHours(
    0,
    0,
    0,
    0
);

let mesAtual =
    new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    );

let etapaAtual =
    1;

const pedido = {

    servico:
        "",

    dataSel:
        null,

    hora:
        ""

};

const fluxo =
    $("fluxo");

const etapas =
    fluxo.querySelectorAll(
        ".etapa"
    );

const nomeMeses = {

    data: (d) =>

        d.toLocaleDateString(
            "pt-BR",
            {
                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        )

};

/* ==========================================
   PROGRESSO
   ========================================== */

function atualizarProgresso(
    n
) {

    fluxo
        .querySelectorAll(
            ".progresso li"
        )
        .forEach(
            (li) => {

                const p =
                    Number(
                        li.dataset.passo
                    );

                li.classList.toggle(
                    "atual",
                    p === n
                );

                li.classList.toggle(
                    "feito",
                    p < n
                );

                li.classList.toggle(
                    "oculto",
                    n === 7
                );

                if (
                    p === n
                ) {

                    li.setAttribute(
                        "aria-current",
                        "step"
                    );

                } else {

                    li.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );

}

/* ==========================================
   MUDAR DE ETAPA
   ========================================== */

function irParaEtapa(
    n
) {

    etapaAtual =
        Math.max(
            1,
            Math.min(
                7,
                n
            )
        );

    etapas.forEach(
        (e) => {

            const ativa =
                Number(
                    e.dataset.etapa
                ) ===
                etapaAtual;

            e.hidden =
                !ativa;

            e.classList.toggle(
                "etapa--ativa",
                ativa
            );

        }
    );

    atualizarProgresso(
        etapaAtual
    );

    if (
        etapaAtual === 3
    ) {

        desenharCalendario();

    }

    if (
        etapaAtual === 4
    ) {

        desenharHorarios();

    }

    if (
        etapaAtual === 6
    ) {

        desenharRevisao();

    }

    if (
        etapaAtual === 7
    ) {

        atualizarConfirmacao();

    }

    const titulo =
        fluxo.querySelector(
            `.etapa[data-etapa="${etapaAtual}"] h3`
        );

    fluxo.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

    if (titulo) {

        setTimeout(
            () => {

                titulo.focus({
                    preventScroll:
                        true
                });

            },
            250
        );

    }

}

/* ==========================================
   VALIDAÇÃO
   ========================================== */

function validarEtapa(
    n
) {

    const preenchido =
        (ids) =>

            ids.every(
                (id) =>
                    $(id)
                        .value
                        .trim()
            );

    if (
        n === 1 &&
        !pedido.servico
    ) {

        return
            "Selecione um serviço para continuar.";

    }

    if (
        n === 2 &&
        !preenchido([
            "lcCep",
            "lcEstado",
            "lcCidade",
            "lcBairro",
            "lcEndereco",
            "lcNumero"
        ])
    ) {

        return
            "Preencha CEP, estado, cidade, bairro, endereço e número.";

    }

    if (
        n === 3 &&
        !pedido.dataSel
    ) {

        return
            "Selecione uma data disponível.";

    }

    if (
        n === 4 &&
        !pedido.hora
    ) {

        return
            "Selecione um horário disponível.";

    }

    if (
        n === 5
    ) {

        if (
            !preenchido([
                "clNome",
                "clTel",
                "clEmail"
            ])
        ) {

            return
                "Preencha nome, telefone e e-mail.";

        }

        const telefone =
            $("clTel")
                .value
                .replace(
                    /\D/g,
                    ""
                );

        if (
            telefone.length <
            10
        ) {

            return
                "Informe um telefone com DDD.";

        }

        const email =
            $("clEmail")
                .value
                .trim();

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email)
        ) {

            return
                "Informe um e-mail válido.";

        }

    }

    return "";
}

/* ==========================================
   BOTÕES CONTINUAR
   ========================================== */

fluxo
    .querySelectorAll(
        '[data-acao="continuar"]'
    )
    .forEach(
        (btn) => {

            btn.addEventListener(
                "click",
                () => {

                    const etapa =
                        btn.closest(
                            ".etapa"
                        );

                    const erro =
                        validarEtapa(
                            etapaAtual
                        );

                    const msg =
                        etapa.querySelector(
                            ".form__msg"
                        );

                    if (erro) {

                        mostrarMsg(
                            msg,
                            erro,
                            "erro"
                        );

                        return;

                    }

                    mostrarMsg(
                        msg,
                        ""
                    );

                    irParaEtapa(
                        etapaAtual + 1
                    );

                }
            );

        }
    );

/* ==========================================
   BOTÕES VOLTAR
   ========================================== */

fluxo
    .querySelectorAll(
        '[data-acao="voltar"]'
    )
    .forEach(
        (btn) => {

            btn.addEventListener(
                "click",
                () => {

                    irParaEtapa(
                        etapaAtual - 1
                    );

                }
            );

        }
    );

/* ==========================================
   LIBERAR CONTINUAR
   ========================================== */

function liberar(
    n,
    ativo
) {

    const btn =
        fluxo.querySelector(
            `.etapa[data-etapa="${n}"] [data-acao="continuar"]`
        );

    if (btn) {

        btn.disabled =
            !ativo;

    }

}

/* ==========================================
   ETAPA 1 — SERVIÇOS
   ========================================== */

const boxServicos =
    $("opcoesServico");

servicosAgenda.forEach(
    (nome) => {

        const b =
            document.createElement(
                "button"
            );

        b.type =
            "button";

        b.className =
            "opcao";

        b.setAttribute(
            "role",
            "radio"
        );

        b.setAttribute(
            "aria-checked",
            "false"
        );

        b.innerHTML = `
            <span
                class="opcao__marcador"
                aria-hidden="true"
            ></span>

            <span>
                <strong>
                    ${nome}
                </strong>

                <small>
                    Solicitar atendimento
                </small>
            </span>
        `;

        b.addEventListener(
            "click",
            () => {

                pedido.servico =
                    nome;

                boxServicos
                    .querySelectorAll(
                        ".opcao"
                    )
                    .forEach(
                        (o) => {

                            const selecionada =
                                o ===
                                b;

                            o.classList.toggle(
                                "opcao--sel",
                                selecionada
                            );

                            o.setAttribute(
                                "aria-checked",
                                String(
                                    selecionada
                                )
                            );

                        }
                    );

                liberar(
                    1,
                    true
                );

            }
        );

        boxServicos.appendChild(
            b
        );

    }
);

/* ==========================================
   ETAPA 3 — CALENDÁRIO
   ========================================== */

function diaDisponivel(
    d
) {

    return (

        d >= hoje &&

        diasDisponiveis.includes(
            d.getDay()
        ) &&

        !diasBloqueados.includes(
            chaveData(d)
        )

    );

}

function desenharCalendario() {

    const ano =
        mesAtual.getFullYear();

    const mes =
        mesAtual.getMonth();

    $("mesTitulo")
        .textContent =
        mesAtual.toLocaleDateString(
            "pt-BR",
            {
                month:
                    "long",

                year:
                    "numeric"
            }
        );

    const container =
        $("dias");

    container.innerHTML =
        "";

    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        ).getDay();

    for (
        let i = 0;
        i < primeiroDia;
        i++
    ) {

        const vazio =
            document.createElement(
                "span"
            );

        vazio.className =
            "dia--vazio";

        container.appendChild(
            vazio
        );

    }

    const totalDias =
        new Date(
            ano,
            mes + 1,
            0
        ).getDate();

    for (
        let n = 1;
        n <= totalDias;
        n++
    ) {

        const data =
            new Date(
                ano,
                mes,
                n
            );

        const btn =
            document.createElement(
                "button"
            );

        btn.type =
            "button";

        btn.className =
            "dia";

        btn.textContent =
            n;

        btn.disabled =
            !diaDisponivel(
                data
            );

        if (
            data.getTime() ===
            hoje.getTime()
        ) {

            btn.classList.add(
                "dia--hoje"
            );

        }

        if (
            pedido.dataSel &&
            chaveData(
                pedido.dataSel
            ) ===
            chaveData(data)
        ) {

            btn.classList.add(
                "dia--sel"
            );

        }

        btn.setAttribute(
            "aria-label",
            data.toLocaleDateString(
                "pt-BR",
                {
                    dateStyle:
                        "full"
                }
            )
        );

        btn.addEventListener(
            "click",
            () => {

                pedido.dataSel =
                    data;

                pedido.hora =
                    "";

                liberar(
                    4,
                    false
                );

                desenharCalendario();

            }
        );

        container.appendChild(
            btn
        );

    }

    $("dataSelecionada")
        .textContent =
        pedido.dataSel
            ? `Data escolhida: ${nomeMeses.data(
                pedido.dataSel
            )}`
            : "Nenhuma data selecionada";

    liberar(
        3,
        Boolean(
            pedido.dataSel
        )
    );

}

/* ==========================================
   MÊS ANTERIOR
   ========================================== */

$("mesAnterior")
    .addEventListener(
        "click",
        () => {

            const anterior =
                new Date(
                    mesAtual.getFullYear(),
                    mesAtual.getMonth() - 1,
                    1
                );

            const ano =
                anterior.getFullYear();

            const mes =
                anterior.getMonth();

            const anoAtual =
                hoje.getFullYear();

            const mesAtualNumero =
                hoje.getMonth();

            if (
                ano <
                    anoAtual ||

                (
                    ano ===
                    anoAtual &&

                    mes <
                    mesAtualNumero
                )
            ) {

                return;

            }

            mesAtual =
                anterior;

            desenharCalendario();

        }
    );

/* ==========================================
   MÊS PRÓXIMO
   ========================================== */

$("mesProximo")
    .addEventListener(
        "click",
        () => {

            mesAtual =
                new Date(
                    mesAtual.getFullYear(),
                    mesAtual.getMonth() + 1,
                    1
                );

            desenharCalendario();

        }
    );

/* ==========================================
   ETAPA 4 — HORÁRIOS
   ========================================== */

function desenharHorarios() {

    if (
        !pedido.dataSel
    ) {

        return;

    }

    const bloqueados =
        horariosBloqueados[
            chaveData(
                pedido.dataSel
            )
        ] || [];

    $("dataHorario")
        .textContent =
        nomeMeses.data(
            pedido.dataSel
        );

    const box =
        $("horarios");

    box.innerHTML =
        "";

    horariosDisponiveis
        .forEach(
            (h) => {

                const btn =
                    document.createElement(
                        "button"
                    );

                btn.type =
                    "button";

                btn.className =
                    "horario" +
                    (
                        pedido.hora === h
                            ? " horario--sel"
                            : ""
                    );

                btn.textContent =
                    h;

                btn.disabled =
                    bloqueados.includes(
                        h
                    );

                btn.addEventListener(
                    "click",
                    () => {

                        pedido.hora =
                            h;

                        box
                            .querySelectorAll(
                                ".horario"
                            )
                            .forEach(
                                (b) => {

                                    b.classList.toggle(
                                        "horario--sel",
                                        b === btn
                                    );

                                }
                            );

                        liberar(
                            4,
                            true
                        );

                    }
                );

                box.appendChild(
                    btn
                );

            }
        );

    liberar(
        4,
        Boolean(
            pedido.hora
        )
    );

}

/* ==========================================
   ENDEREÇO
   ========================================== */

function enderecoTexto() {

    const complemento =
        $("lcComplemento")
            .value
            .trim();

    const primeiraParte =
        `${$("lcEndereco").value.trim()}, nº ${$("lcNumero").value.trim()}`;

    const segundaParte =
        complemento
            ? ` (${complemento})`
            : "";

    const linhaEndereco =
        primeiraParte +
        segundaParte;

    const linhaLocal =
        `${$("lcBairro").value.trim()}, ${$("lcCidade").value.trim()} - ${$("lcEstado").value.trim()}, CEP ${$("lcCep").value.trim()}`;

    return (
        linhaEndereco +
        "\n" +
        linhaLocal
    );

}

/* ==========================================
   ETAPA 6 — REVISÃO
   ========================================== */

function desenharRevisao() {

    const linhas = [

        [
            "Serviço",
            pedido.servico,
            1
        ],

        [
            "Local",
            enderecoTexto(),
            2
        ],

        [
            "Data",
            nomeMeses.data(
                pedido.dataSel
            ),
            3
        ],

        [
            "Horário",
            pedido.hora,
            4
        ],

        [
            "Nome",
            $("clNome")
                .value
                .trim(),
            5
        ],

        [
            "Telefone",
            $("clTel")
                .value
                .trim(),
            5
        ],

        [
            "E-mail",
            $("clEmail")
                .value
                .trim(),
            5
        ]

    ];

    const dl =
        $("revisao");

    dl.innerHTML =
        "";

    linhas.forEach(
        (
            [
                rotulo,
                valor,
                etapa
            ]
        ) => {

            const linha =
                document.createElement(
                    "div"
                );

            const dt =
                document.createElement(
                    "dt"
                );

            const dd =
                document.createElement(
                    "dd"
                );

            const ed =
                document.createElement(
                    "button"
                );

            dt.textContent =
                rotulo;

            dd.textContent =
                valor;

            ed.type =
                "button";

            ed.className =
                "editar";

            ed.textContent =
                "Editar";

            ed.setAttribute(
                "aria-label",
                "Editar " + rotulo
            );

            ed.addEventListener(
                "click",
                () => {

                    irParaEtapa(
                        etapa
                    );

                }
            );

            linha.append(
                dt,
                dd,
                ed
            );

            dl.appendChild(
                linha
            );

        }
    );

}

/* ==========================================
   ETAPA 7 — WHATSAPP
   ========================================== */

function montarMensagemWhats() {

    const obs =
        $("lcObs")
            .value
            .trim();

    return [

        "Olá! Gostaria de solicitar um atendimento.",

        "",

        "Empresa: L.A. Jardinagem",

        "Serviço: " +
            pedido.servico,

        "Endereço: " +
            enderecoTexto()
                .replace(
                    "\n",
                    " - "
                ),

        "Data: " +
            nomeMeses.data(
                pedido.dataSel
            ),

        "Horário: " +
            pedido.hora,

        "Nome: " +
            $("clNome")
                .value
                .trim(),

        "Telefone: " +
            $("clTel")
                .value
                .trim(),

        "E-mail: " +
            $("clEmail")
                .value
                .trim(),

        "Observações: " +
            (
                obs ||
                "-"
            )

    ].join(
        "\n"
    );

}

/* ==========================================
   CONFIRMAÇÃO
   ========================================== */

function atualizarConfirmacao() {

    $("confirmacaoServico")
        .textContent =
        pedido.servico;

    $("confirmacaoData")
        .textContent =
        `${nomeMeses.data(
            pedido.dataSel
        )} às ${pedido.hora}`;

    mostrarMsg(
        $("msgWhats"),
        ""
    );

}

/* ==========================================
   CONFIRMAR
   ========================================== */

$("btnConfirmar")
    .addEventListener(
        "click",
        () => {

            const erro =
                validarEtapa(
                    5
                );

            if (erro) {

                mostrarMsg(
                    fluxo.querySelector(
                        '.etapa[data-etapa="6"] .form__msg'
                    ),
                    erro,
                    "erro"
                );

                return;

            }

            irParaEtapa(
                7
            );

        }
    );

/* ==========================================
   ABRIR WHATSAPP
   ========================================== */

$("btnWhats")
    .addEventListener(
        "click",
        () => {

            if (
                !/^\d{10,15}$/.test(
                    numeroWhatsApp
                )
            ) {

                mostrarMsg(
                    $("msgWhats"),

                    "O WhatsApp da empresa ainda não foi configurado. Altere numeroWhatsApp no script.js.",

                    "erro"
                );

                return;

            }

            const url =
                `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                    montarMensagemWhats()
                )}`;

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            mostrarMsg(
                $("msgWhats"),

                "O WhatsApp foi aberto. Envie a mensagem para concluir a solicitação.",

                "ok"
            );

        }
    );

/* ==========================================
   NOVA SOLICITAÇÃO
   ========================================== */

$("btnNova")
    .addEventListener(
        "click",
        () => {

            fluxo
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(
                    (campo) => {

                        campo.value =
                            "";

                    }
                );

            pedido.servico =
                "";

            pedido.dataSel =
                null;

            pedido.hora =
                "";

            mesAtual =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth(),
                    1
                );

            boxServicos
                .querySelectorAll(
                    ".opcao"
                )
                .forEach(
                    (opcao) => {

                        opcao.classList.remove(
                            "opcao--sel"
                        );

                        opcao.setAttribute(
                            "aria-checked",
                            "false"
                        );

                    }
                );

            [1, 3, 4]
                .forEach(
                    (n) => {

                        liberar(
                            n,
                            false
                        );

                    }
                );

            mostrarMsg(
                $("msgWhats"),
                ""
            );

            irParaEtapa(
                1
            );

        }
    );

/* ==========================================
   FORMULÁRIO DE CONTATO
   ========================================== */

$("formContato")
    .addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const msg =
                $("msgContato");

            const email =
                $("ctEmail")
                    .value
                    .trim();

            const campos = [

                $("ctNome")
                    .value,

                $("ctTel")
                    .value,

                email,

                $("ctMsg")
                    .value

            ];

            if (
                campos.some(
                    (campo) =>
                        !campo.trim()
                )
            ) {

                mostrarMsg(
                    msg,
                    "Preencha todos os campos.",
                    "erro"
                );

                return;

            }

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                mostrarMsg(
                    msg,
                    "Informe um e-mail válido.",
                    "erro"
                );

                return;

            }

            mostrarMsg(
                msg,

                "Campos válidos. O formulário está pronto para ser conectado a um serviço ou backend; nenhuma mensagem foi enviada.",

                "ok"
            );

        }
    );

/* ==========================================
   ANO DO RODAPÉ
   ========================================== */

$("ano")
    .textContent =
    new Date()
        .getFullYear();

/* ==========================================
   ANIMAÇÃO DE ENTRADA
   ========================================== */

document
    .querySelectorAll(
        ".card, .destaques li, .galeria__item, .sobre > *"
    )
    .forEach(
        (el) => {

            el.classList.add(
                "revelar"
            );

        }
    );

if (
    "IntersectionObserver"
    in window
) {

    const obs =
        new IntersectionObserver(
            (itens) => {

                itens.forEach(
                    (item) => {

                        if (
                            item.isIntersecting
                        ) {

                            item.target.classList.add(
                                "visivel"
                            );

                            obs.unobserve(
                                item.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.1
            }
        );

    document
        .querySelectorAll(
            ".revelar"
        )
        .forEach(
            (el) => {

                obs.observe(
                    el
                );

            }
        );

} else {

    document
        .querySelectorAll(
            ".revelar"
        )
        .forEach(
            (el) => {

                el.classList.add(
                    "visivel"
                );

            }
        );

}

/* ==========================================
   INICIALIZAÇÃO
   ========================================== */

irParaEtapa(
    1
);

desenharCalendario();