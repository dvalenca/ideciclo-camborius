# **Apêndice \\- Cálculo dos critérios**

Aqui o como são calculadas cada uma das notas das folhas da árvore de critérios com suas notas calculadas pela função binária:

## **Função binária**

As notas de funções binárias são determinadas pela existência ou inexistência de algum risco, pode ser resumida na seguinte tabela as situações que dão nota máxima (10) para o critério e, que caso não cumpra, anulam-se:

| `Critério` | `Fator que garante nota máxima` |
| :---- | :---- |
| `1.2. Situações de Riscos` | `Inexistência de qualquer situação de risco na estrutura cicloviária.` |
| `1.2.2.1 Sinalização de Início` | `Existência da placa de sinalização de início.` |
| `1.2.2.2 Sinalização de Fim` | `Existência da placa de sinalização de fim.` |
| `1.4.5. Desníveis` | `Inexistência de desníveis na estrutura cicloviária.` |
| `1.4.6. Bidirecionalidade` | `A estrutura é bidirecional.` |
| `2.1.2.3. Outros controles` | `Existência de qualquer outro controle de velocidade na via.` |
| `2.2.1. Riscos ao Longo da Estrutura` | `Inexistência de qualquer situação de risco ao longo da estrutura cicloviária.` |
| `2.3.1. Riscos nos Cruzamentos` | `Inexistência de qualquer situação de risco nos cruzamentos com a estrutura.` |

## **Valor interpolado**

A interpolação linear é uma função que tem a seguinte função:  
f(x)=ax \\+ b   
Para obter os valores de a e b, usa-se dois pontos coordenados:  
(x1,y1), (x2,y2)  
\tE a partir destes usa as fórmulas para obter os valores:  
a \\= (y1\\-y2) / (x1 \\-x2)  
b \\= (x1y2\\-x2y1) / (x1 \\-x2)  
A partir, então, dos valores dos pares ordenados (x1, y1) e (x2, y2). É importante saber que, caso os valores passem para cima ou para baixo os valores da nota, esses valores são considerados nulos ou máximo conforme cada caso.

| `Critério` | `(x1;y1)\u000B(x2;y2)` | `Explicação` |
| :---- | :---- | :---- |
| `1.1.3.2. Faixa de Amortecimento` | `(0,3;0)\u000B(1;10)` | `x é a largura da faixa e a menor faixa admissível é de 0,3m, que levaria nota 0 e a partir de 1,0m todas levam nota 10.` |
| `1.2.1. Sinalização vertical regulamentadora` | `(1/0,3;0)\u000B(1/0,1;10)` | `Recomenda-se 1 placa a cada 100 metros, cumprir ao menos o mínimo disso leva nota 10 e 1/3 ou abaixo disso fica com nota zero.` |
| `1.3.2. Presença de Setas e Pictogramas e 3.1.2.2. Condições dos Pictogramas e Setas` | `(1/0,15;0)\u000B(1/0,03;0)` | `Recomenda-se 1 pictogramas e setas a cada 30 metros, cumprir ao menos o mínimo disso leva nota 10 e 1/3 ou abaixo disso fica com nota zero. Para condições de setas e pictogramas, um elemento em má condição de conservação é considerado como meio elemento.` |
| `Para UNIDIRECIONAL 1.4.4. Largura Transitável`  | `(1,2;0) (1,5;8)  ou (1,5;8) (2,5;10)` | `O valor mínimo em manual é 1,2m e o recomendado 1,5m. Portanto, esses valores vão variar entre 0 e 8 em nota. Foi escolhido de 8 a 10 colocar de 1,5 a 2,5m, de forma a estimular estruturas mais largas para ultrapassagem ou conforto.` |
| `Para BIDIRECIONAL 1.4.4. Largura Transitável`  | `(2,2;0) (2,5;8) ou (2,5;8), (3,5;10)` | `O valor mínimo em manual é 2,2m e o recomendado 2,5m. Portanto, esses valores vão variar entre 0 e 8 em nota. Foi escolhido de 8 a 10 colocar de 2,5 a 3,5m, de forma a estimular estruturas mais largas para ultrapassagem ou conforto.` |
| `2.1.1. Controle eletrônico` | `(1;0)\u000B(1/0,5;10)` | `A cada 500m recomenda-se um controle eletrônico de velocidade para vias com mais de 30km/h, cumprir o mínimo disso leva nota 10 e 1/2 ou abaixo disso fica com nota zero.` |
| `2.1.2.1. Tamanho de quadra` | `(300;0), (100,10)` | `Foram escolhidas quadras maiores que 300m como nota zero e menores que 100m nota 10. Quadras menores induzem velocidades menores.` |
| `2.1.2.2. Largura da faixa` | `(3,5;0), (2,5;10)` | `Nos manuais, a menor largura de faixa de trânsito misto possível é de 2,5m que recebe nota 10 e maior é de 3,5m que recebe uma nota zero.` |
| `2.1.2.4.1. Sinalização vertical de velocidade` | `(1/10;0), (1;10)` | `Recomenda-se 1 placas por km, cumprir o mínimo disso leva nota 10 e 1/10 ou abaixo disso fica com nota zero.` |
| `Sinalização horizontal de velocidade` | `(1/5;0); (2;10)` | `Recomenda-se 2 sinalização horizontal por km, cumprir o mínimo disso leva nota 10 e 1/10 ou abaixo disso fica com nota zero.` |
| `1.2.1.3 Controles em desnível` | `(1/0,6;0)\u000B(1/0,2;10)` | `Recomenda-se 1 controle em desnível a cada 200m, levando nota 10 e abaixo de 1/3 leva nota zero.`  |
| `3.2.1. Obstáculos` | `(2;0); (0;10)` | `É tolerável até 2 obstáculos por km, acima disso a nota é zero, sendo zero obstáculos a nota máxima.` |
| `3.2.3. Iluminação` | `(262/w; 0) (66/w;10)` | `A recomendação varia de acordo com a largura da via (w) e diversos outros fatores. Foi escolhido o padrão 33200 lumens em um poste de 12m. Além disso, postes não exclusivos valem menos, sendo 0,9 para do mesmo lado e até 0,63 pro lado oposto, a depender da largura da via.` |

A fórmula para o cálculo da iluminação é trazida por JIGNESH, 2023\\.

## **Proporcional**

São todos calculados contando a quantidade de observações da existência ao total do esperado onde deveria existir. Por exemplo, para a sinalização vertical nas travessias, são contadas o total de travessias e faz-se a relação com o total de sinalizações observadas. Para os critérios: 

* **1.2.3. Sinalização Vertical nas Travessias**  
* **1.3.4. Sinalização Horizontal nos Cruzamentos**

Para os critérios abaixo, há alguns condicionantes na fórmula

* **1.4.1. Acesso à Estrutura** \\- só serão contabilizados para ciclovias e ciclofaixas e quando os valores forem diferente de "Segregadores NÃO DIFICULTAM o acesso". Nesses casos, é feita uma razão entre o total de acessos e o total de vias com ou sem acessos, sendo 10 a nota máxima.   
* **3.1.2.4. Condição da Sinalização Horizontal nos Cruzamentos** \\- os cruzamentos em que a condição não esteja perfeita, é contada como meia sinalização. Ou seja, a proporção é dada por:

Nota \\= (Sinalizações perfeitas \\+ ½ \\* Sinalizações imperfeitas)/Total de cruzamentos

## **Padrões de avaliação** 

**1.1. Concepção do projeto**  
A nota para ciclovias e ciclofaixas é calculada conforme o padrão da tabela abaixo em que os códigos significam:

* BU \\- Ciclovia ou ciclofaixa de mão bidirecional em uma via de mão dupla  
* BD \\- Ciclovia ou ciclofaixa de mão bidirecional em uma via de mão única  
* UU \\- Ciclovia ou ciclofaixa de mão unidirecional em uma via de mão única  
* UD \\- Ciclovia ou ciclofaixa de mão unidirecional em uma via de mão dupla

| `Item do formulário` | `BU` | `BD` | `UU` | `UD` |
| :---- | :---- | :---- | :---- | :---- |
| `Isoladas (em área verde)` | `10` | `10` | `10` | `10` |
| `No bordo esquerdo da via de mão única` | `7,5` | `N/A` | `7,5` | `7,5` |
| `Na via, junto ao canteiro central/canal` | `5` | `5` | `7,5` | `5` |
| `No canteiro central` | `5` | `5` | `5` | `5` |
| `Sobre a calçada` | `2,5` | `5` | `5` | `2,5` |
| `No bordo direito da via de mão única` | `0` | `N/A` | `7,5` | `7,5` |
| `Em um dos bordos de via de mão dupla` | `N/A` | `0` | `N/A` | `7,5` |

**1.1.3.1. Tipo de Segregador**

As notas para esse critério são dadas para ciclovias e ciclofaixas, que não estejam colocadas sobre a calçada, conforme a seguinte lista:

* Canteiros: 10,  
* Guias: 8,  
* Prismas ou blocos de concreto: 6,  
* Balizadores, tachas ou tachões: 4,  
* Sinalização com pintura: 2,  
* Não há: 0

**1.3.1. Padrão de Sinalização Horizontal**

As notas para esse critério são dadas para ciclovias e ciclofaixas conforme a seguinte lista:

* Toda área de circulação pintada de vermelho: 10,  
* Pintada de vermelho com interrupções: 6.7,  
* Apenas faixas vermelhas nas bordas, com travessias pintadas nos cruzamentos: 3.3,  
* Apenas faixas vermelhas nas bordas.: 0

**1.4.3. Sinuosidade do traçado**

As notas para esse critério são dadas conforme a seguinte lista:

* O traçado é completamente reto: 10,  
* O traçado é sinuoso, exigindo atenção: 6.6,  
* O traçado é muito sinuoso, podendo causar colisões com obstáculos ou outros ciclistas em momento de ultrapassagem: 3.3,  
* O traçado é muito sinuoso ou possui curvas com obstáculos que impedem visualização de entorno ou parte da estrutura: 0

**3.1.1. Situação do Piso**

As notas para esse critério são dadas conforme a seguinte lista:

* Bom estado: 10,  
* Pequenas imperfeições, como fissuras: 8,  
* Falhas que demandam redução de velocidade ou parada: 6,  
* Irregularidades que demandam desvio para circulação: 4,  
* Buracos grandes que demandam saída a estrutura: 2,  
* Totalmente destruído, impossível transitar: 0

**3.1.2.1. Condição de Sinalização Horizontal**

As notas para esse critério são dadas conforme a seguinte lista:

* A pintura está boa, COMPLETA e visível: 10,  
* A pintura está boa, mas FALHA em ALGUNS pontos: 8,  
* A pintura é falha em VÁRIOS pontos: 4,  
* A pintura é MUITO falha, mostrando muito asfalto: 2,  
* Pintura APAGADA ou somente rastros de tinta: 0

**3.1.3. Situação da Proteção**

As notas para esse critério são dadas para ciclovias e ciclofaixas conforme a seguinte lista:

* SE CICLOVIA, segregação impede completamente a invasão de automóvel e não há trechos desprotegidos: 10,  
* SE CICLOFAIXA, impossível automóvel invadir a estrutura sem ultrapassar por segregadores: 10,  
* Poucos trechos SEM segregadores dificultando invasão: 6.6,  
* Poucos trechos COM segregadores dificultando invasão: 3.3,  
* NENHUM ou QUASE NENHUM segregador dificultando invasão: 0

**3.2.2. Sombreamento**

As notas para esse critério são dadas conforme a seguinte lista:

* Sombras na MAIOR PARTE da extensão: 10,  
* Sombras em PRATICAMENTE TODA a extensão: 8,  
* Sombras em alguns trechos, COM mudas plantadas: 6,  
* Sombras em alguns trechos, SEM mudas novas: 4,  
* Somente mudas novas: 2,  
* Não há árvores nem mudas: 0