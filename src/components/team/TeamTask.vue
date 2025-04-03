<template>
  <div class="task-description">
    <h1 class="task-title">Описание задания</h1>

    <div class="task-content">
      <p class="task-intro">
        Удаленному месторождению для обеспечения электроснабжения своих объектов суммарной установленной мощностью 80 МВт,
        необходима электроэнергия, вырабатываемая на газотурбинной электростанции (ГТЭС), а для обеспечения теплом – собственные
        котельные установки или тепловая сеть, питающаяся от котлов-утилизаторов, установленных на ГТЭС.
      </p>

      <div class="task-section">
        <h2>Условия:</h2>
        <ol>
          <li>Центром электрических нагрузок принять объект 2 (Рисунок 1).</li>
          <div class="figure-container">
            <img src="@/assets/img/task.jpg" alt="Схема расположения объектов" class="task-image">
            <p class="figure-caption">Рисунок 1 - Схема расположения объектов</p>
          </div>
          <li>Кустовые площадки возможно располагать в произвольном порядке, с учетом заданных расстояний от центра нагрузок.</li>
          <li>Объекты находятся в зоне тундры</li>
        </ol>
      </div>

      <div class="task-section">
        <h2>Задача команд:</h2>
        <p>
          Командам необходимо создать цифровую модель энергетической системы месторождения и предложить оптимальный алгоритм
          управления источниками выработки энергии (газотурбинными агрегатами), минимизирующие ее себестоимость, как тепловой,
          так и электрической.
        </p>
        <p>
          Схема энергоснабжения месторождения комбинированная, включающая в себя разновидности генерирующих установок на различных
          видах топлива (попутный нефтяной газ (ПНГ), сухой отбензиненный газ (СОГ)). На рассматриваемом объекте уровень использования
          ПНГ для целей генерации тепловой и электрической энергии составляет 95% при удельном расходе ПНГ/СОГ 0,30 м3/кВт*ч.
          По плановым показателям в течение следующих 22 лет уровень использования ПНГ для генерирования электроэнергии должен
          составить не менее 98%.
        </p>
      </div>


    </div>
  </div>
</template>

<style scoped>
.task-description {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
  font-size: 2rem;
  color: #333333;
  margin-bottom: 2rem;
  font-weight: 600;
}

.task-content {
  color: #333333;
  line-height: 1.6;
}

.task-section {
  margin: 2rem 0;
}

.task-section h2 {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1rem;
  font-weight: 500;
}

.task-intro {
  font-size: 1.1rem;
  color: #333333;
  margin-bottom: 2rem;
}

.figure-container {
  margin: 1rem 0;
  text-align: center;
}

.task-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.figure-caption {
  font-style: italic;
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

ul, ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .task-description {
    padding: 1rem;
  }

  .task-title {
    font-size: 1.5rem;
  }

  .task-section h2 {
    font-size: 1.25rem;
  }
}
</style>