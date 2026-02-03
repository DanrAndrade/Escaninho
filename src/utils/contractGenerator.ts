import { API_URL } from '@/lib/api';

const getBase64ImageFromUrl = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 100;
            canvas.height = img.height || 100;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } else {
                resolve('');
            }
        };
        img.onerror = () => resolve('');
        img.src = url;
    });
};

export const generateContractPDF = async (reserva: any) => {
    try {
        const pdfMake = (await import('pdfmake/build/pdfmake')).default;
        const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
        // @ts-ignore
        pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
        // @ts-ignore
        const htmlToPdfmake = (await import('html-to-pdfmake')).default;

        const [resContrato, logoPngBase64] = await Promise.all([
            fetch(`${API_URL}/api/contrato-atual`).then(r => r.json()).catch(() => ({ texto: '' })),
            getBase64ImageFromUrl('/logo.svg')
        ]);

        const textoHTML = resContrato.texto || "<p>Contrato não disponível.</p>";

        // CONVERSÃO DO HTML (FONTE 12)
        const conteudoContrato = htmlToPdfmake(textoHTML, {
            defaultStyles: {
                // AQUI: Define o tamanho padrão para 12
                p: { fontSize: 12, alignment: 'justify', lineHeight: 1.3, margin: [0, 5, 0, 5] },
                li: { fontSize: 12, alignment: 'justify', margin: [0, 2, 0, 2] },
                strong: { bold: true },
                h3: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                h4: { fontSize: 13, bold: true, margin: [0, 10, 0, 5] }
            }
        });

        const docDefinition: any = {
            pageSize: 'A4',
            pageMargins: [40, 40, 40, 60],
            
            content: [
                logoPngBase64 ? { image: logoPngBase64, width: 60, alignment: 'center', margin: [0, 0, 0, 10] } : null,
                
                { text: 'CONTRATO DE LOCAÇÃO DE ESCANINHO', style: 'header' },
                
                {
                    style: 'infoTable',
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                stack: [
                                    { text: [{ text: 'CONTRATANTE: ', bold: true }, reserva.nome_responsavel] },
                                    { text: [{ text: 'ALUNO: ', bold: true }, `${reserva.nome_aluno} (RA: ${reserva.ra || 'N/A'})`] },
                                    { text: [{ text: 'ARMÁRIO: ', bold: true }, reserva.locker_number] },
                                    { text: [{ text: 'DATA: ', bold: true }, new Date(reserva.data_reserva).toLocaleDateString('pt-BR')] }
                                ],
                                fillColor: '#f8fafc',
                                border: [true, true, true, true],
                                margin: [5, 5, 5, 5]
                            }]
                        ]
                    },
                    layout: 'noBorders'
                },

                { text: ' ', margin: [0, 10] },
                
                // Texto do contrato (Fonte 12 aplicada)
                conteudoContrato,

                { text: ' ', margin: [0, 20] },

                {
                    stack: [
                        { text: '___________________________________________________', alignment: 'center', color: '#888' },
                        { text: 'ASSINATURA DIGITAL', bold: true, alignment: 'center', fontSize: 10, margin: [0, 5, 0, 0] },
                        { text: `Assinado por: ${reserva.nome_responsavel}`, alignment: 'center', fontSize: 9, color: '#444' },
                        { text: `Data/Hora: ${new Date(reserva.data_assinatura || Date.now()).toLocaleString('pt-BR')}`, alignment: 'center', fontSize: 9, color: '#444' },
                        // Garante que o IP apareça ou mostre aviso
                        { text: `IP: ${reserva.ip_address ? reserva.ip_address : 'IP não registrado no momento da assinatura'}`, alignment: 'center', fontSize: 9, color: '#444' }
                    ]
                }
            ].filter(Boolean),
            
            styles: {
                header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
                infoTable: { margin: [0, 0, 0, 15] }
            },
            info: {
                title: `Contrato_Armario_${reserva.locker_number}`,
                author: 'Sistema Escaninho'
            }
        };

        pdfMake.createPdf(docDefinition).download(`Contrato_Box${reserva.locker_number}.pdf`);

    } catch (error) {
        console.error("Erro PDF:", error);
        alert("Erro ao gerar PDF.");
    }
};