<script setup>
defineProps({
  meta: {
    type: Object,
    required: true,
    validator(value) {
      return ['page', 'pageCount', 'total'].every(key => key in value);
    }
  }
});

const emit = defineEmits(['goToPage']);
</script>

<template>
  <div v-if="meta.pageCount > 1" class="pagination">
    <button
        @click="$emit('goToPage', meta.page - 1)"
        :disabled="meta.page <= 1"
        class="pagination-btn"
        aria-label="Предыдущая страница"
    >
      Назад
    </button>

    <template v-for="pageNum in visiblePages" :key="pageNum">
      <button
          @click="$emit('goToPage', pageNum)"
          :disabled="pageNum === meta.page"
          :class="['pagination-btn', { 'active': pageNum === meta.page }]"
      >
        {{ pageNum }}
      </button>
    </template>

    <button
        @click="$emit('goToPage', meta.page + 1)"
        :disabled="meta.page >= meta.pageCount"
        class="pagination-btn"
        aria-label="Следующая страница"
    >
      Вперёд
    </button>
  </div>

  <div v-if="meta.pageCount > 1" class="pagination-info">
    Страница {{ meta.page }} из {{ meta.pageCount }} (всего: {{ meta.total }})
  </div>
</template>

<script>
export default {
  computed: {
    visiblePages() {
      const total = this.meta.pageCount;
      const current = this.meta.page;
      const maxVisible = 5;

      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      const start = Math.max(1, current - Math.floor(maxVisible / 2));
      const end = Math.min(total, start + maxVisible - 1);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f3f5;
  border-color: #adb5bd;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-info {
  text-align: center;
  margin-top: 12px;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>