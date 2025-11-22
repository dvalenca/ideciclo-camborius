# **Metodologia - GERAL**

A metodologia do IDECICLO – Índice de Desenvolvimento Cicloviário, criada e desenvolvida pela Ameciclo \- Associação Metropolitana de Ciclistas do Grande Recife. A metodologia consiste na análise da malha cicloviária da cidade e da qualidade das estruturas cicloviárias.

## **O IDECICLO**

O Índice de Desenvolvimento Cicloviário parte da premissa de que a necessidade da implantação de estrutura cicloviária está diretamente relacionada à permissividade de altas velocidades, peso e fluxo de veículos nos meios urbanos. Uma vez dada essa permissão, é necessária a implantação de uma estrutura cicloviária de proteção às demais pessoas que utilizam as vias.  
Para a medição desses parâmetros, como aproximação, é utilizada a hierarquia  das vias e a ponderação conforme a energia cinética em trânsito no local. A hierarquia é dividida em três categorias, conforme o Código de Trânsito Brasileiro (BRASIL, 1997):

* **Arteriais**: vias de alta velocidade e/ou fluxo, onde há uma necessidade mínima de ciclovias no local, com a finalidade de propiciar maior proteção a quem pedala.  
* **Coletoras**: vias de velocidade e/ou fluxo medianos, onde há uma necessidade mínima de ciclofaixas no local, com a finalidade de propiciar alguma proteção a quem pedala.  
* **Locais:** vias de menor velocidade e/ou fluxo, onde há necessidade de controle de velocidade, mas que há a possibilidade de compartilhamento das vias.

Para o cálculo do IDECICLO, as vias de trânsito rápido são enquadradas na mesma categoria das arteriais. As velocidades máximas permitidas pelo CTB serão utilizadas como fatores de ponderação, como veremos a seguir.

### **Fatores de ponderação**

A velocidade máxima prevista no CTB para vias são: **locais \- 30 km/h, coletoras \- 40 km/h e arteriais \- 60 km/h** , o fator de ponderação será utilizado a partir da fórmula da Energia Cinética. Essa é a energia do movimento e é proporcional à massa e ao quadrado da velocidade do objeto em locomoção.  Como o objeto que se segrega ou compartilha espaço com os ciclistas é o mesmo (veículo motorizado: seja moto, carro, caminhão ou ônibus), isola-se a velocidade como fator de mudança e risco de lesões ou mortes em caso de colisão.  
Vias com maiores velocidades necessitam de maior infraestrutura protetiva para pedestres e ciclistas \[calçadas mais largas, mais semáforos de travessia e ciclovias, elementos inibidores da velocidade (tachões, canteiros centrais, entre outros)\] e para os demais usuários da via (limitadores eletrônicos de velocidades) do que as vias de menor velocidade. Isso porque a razão de atropelamento *versus*  mortalidade aumenta bastante, conforme pode ser vista na imagem a seguir (HUSSAIN, 2019). 

Portanto, a maior necessidade de infraestrutura cicloviária é exatamente nas vias mais rápidas e por isso é adotada a ponderação no índice para cada tipo de via. Para tal, é necessário a quantidade total de vias da cidade que possui cada velocidade, ou a divisão conforme o código de trânsito em vias locais, coletoras e arteriais. A partir dessas considerações, propõe-se a seguinte fórmula geral para os fatores de ponderação por hierarquia viária:	

f \=v2302 \+ 402+ 602

Onde f é o fator de ponderação e v é a velocidade máxima de referência. Já aplicando para cada tipo de via, os fatores de ponderação ficam para vias locais:

flocais \=302302+ 402+ 6020,148

Para vias coletoras:

fcoletoras \=402302+ 402 \+ 6020,262

Para vias arteriais:

farteriais \=602302+ 402 \+ 6020,590

Pela metodologia proposta, percebe-se que há um peso maior para a implantação de malha cicloviária em vias arteriais, depois para as coletoras e, por fim, para as locais, completando a lógica da necessidade de implantação de estruturas em vias de maior velocidade e fluxo.

### **Comprimento da malha**

A malha viária da cidade toda é calculada e dividida por cada uma das hierarquias. O IDECICLO usa dados coletados pelo OpenStreetMap (OSM) para obtenção dos comprimentos totais das malhas. O OSM é um projeto colaborativo de mapeamento mundial, baseado na participação voluntária de indivíduos que contribuem com informações geográficas precisas e detalhadas. Lançado em 2004, o OSM permite que usuários criem, editem e compartilhem dados cartográficos, incluindo informações sobre estradas, trilhas, pontos de interesse e mais. O mapa resultante é de código aberto e livre para uso, promovendo acessibilidade, atualização constante e personalização, o que o torna uma valiosa fonte de informações geoespaciais para uma variedade de aplicações, desde navegação até planejamento urbano (OpenStreetMap Wiki, 2023). Cabe ressaltar que o OSM é utilizado em larga escala por grandes corporações mundiais, tais como UBER e Strava, ou pela Administração Pública, como a Prefeitura de São Paulo e o IBAMA.   
Ele utiliza um método de etiquetagem, sendo importante para o IDECICLO  as informações obtidas na etiqueta **highway**, que dá a classificação viária das ruas e vias. Assim, relacionamos os valores das etiquetas com a hierarquia viária proposta:

* **Arteriais**: primary, trunk, motorway e os respectivos *links*  
* **Coletoras**: secondary, tertiary e os respectivos *links*  
* **Residenciais**: residential

É importante que as vias com a etiqueta **unclassified** não ultrapassem o total de 10% do total das vias, para que a cidade tenha dados mais consistentes para o cálculo. Na existência de dados de limites de velocidade, esses são priorizados no uso em vez da classificação viária. Esses dados se encontram na etiqueta **maxspeed** com um valor numérico associado.

## **Cálculo do IDECICLO**

Na sessão seguinte, será mostrado como é calculada a nota média das estruturas cicloviárias. Para isso, apresentaremos primeiramente como se dá o cálculo do IDECICLO, para facilitar a didática e o fluxo do texto. Portanto, deve-se considerar como *N*  sendo a nota obtida \\- que será de **0 a 10** e atribuída a uma estrutura \\- para facilitar a comunicação, seguindo o uso habitual desse formato no âmbito escolar e acadêmico. No entanto, o IDECICLO é um índice e foi escolhido para ser um parâmetro de 3 dígitos de zero a 1\\. Logo, a nota será divida por 10 durante esse cálculo.  
\tÉ importante, antes de tudo, equalizar as vias, a partir do produto da nota pelo comprimento da estrutura específica. Isso é necessário para que estruturas muito longas com uma nota ruim não sejam reduzidas em seu papel, nem estruturas muito curtas com a nota boa sejam superestimadas. Ou seja, uma estrutura de 10km que recebe uma nota 4 acaba tendo o mesmo peso de uma estrutura de 4km que recebeu uma nota 10\\. Chamaremos de *C* a *Contribuição* de uma estrutura:

| C \\=Nd / 10 |
| :---: |

Uma forma de calcular é a divisão pela hierarquia e a criação de IDECICLO intermediários, calculados separadamente por cada malha hierárquica. Assim o índice intermediário é calculado categorizando por tipo de via (local, coletora ou arterial) e matematicamente pode ser expresso assim:

| IDECiclointermediário \\=1DjNj  dj / 10  |
| :---: |

Ou ainda:

| IDECiclointermediário \\=1DjCj   |
| :---: |

Onde D é o comprimento total da malha de um determinado tipo de estrutura (quantos quilômetros de vias locais, coletoras ou arteriais), j é a estrutura (*ciclovia da avenida X, ciclofaixa da rua Y, ciclorrota da estrada W*), N e d são a nota e o comprimento da referida estrutura.  
A partir disso, é possível extrair da fórmula geral do IDECICLO os fatores de ponderação específicos para cada tipo de via e aplicar diretamente nas estruturas avaliadas de forma a obter a contribuição daquela estrutura com o índice cicloviário. Matematicamente, o fator de ponderação de uma cidade é:

| IDECiclo \\=flocais x IDECiclolocais \\+ fcoletoras  x IDECiclocoletoras \\+ farteriais  x IDECicloarteriais |
| :---- |