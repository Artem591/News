<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  availableCategories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'pageSizeChange']);

const updateFilter = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};

const handlePageSizeChange = (event) => {
  const size = Number(event.target.value);
  emit('pageSizeChange', size);
};
</script>

<template>
  <div class="filters">
    <!-- Категория -->
    <div class="filter-group">
      <label for="category-filter">Категория:</label>
      <select
        id="category-filter"
        :value="modelValue.category"
        class="select-input"
        @change="updateFilter('category', $event.target.value)"
      >
        <option value="">Все категории</option>
        <option v-for="cat in availableCategories" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
    </div>

    <!-- Фильтр по рекомендуемым -->
    <div class="filter-group">
      <label for="featured-filter">Тип:</label>
      <select
        id="featured-filter"
        :value="modelValue.featured"
        class="select-input"
        @change="updateFilter('featured', $event.target.value)"
      >
        <option value="">Все статьи</option>
        <option value="true">Только рекомендуемые</option>
      </select>
    </div>

    <!-- Сортировка -->
    <div class="filter-group">
      <label for="sort-select">Сортировка:</label>
      <select
        id="sort-select"
        :value="modelValue.sort"
        class="select-input"
        @change="updateFilter('sort', $event.target.value)"
      >
        <option value="publishedAt:desc">Сначала новые</option>
        <option value="publishedAt:asc">Сначала старые</option>
        <option value="views:desc">По популярности</option>
      </select>
    </div>

    <!-- Размер страницы -->
    <div class="filter-group">
      <label>
        Статей на странице:
        <select :value="modelValue.pageSize" class="select-input" @change="handlePageSizeChange">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-weight: 500;
  color: #495057;
}

.select-input {
  margin-left: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background: white;
  font-size: 14px;
}
</style>