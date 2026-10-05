<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ContextMenu from 'primevue/contextmenu';
import type { MenuItem } from 'primevue/menuitem';
import AppStatusBadge from './AppStatusBadge.vue';
import AppEmptyState from './AppEmptyState.vue';
import AppErrorState from './AppErrorState.vue';
import { currency } from '@/utils/currency';
import type { HrRecord } from '@/types/common';
const { t, te, locale } = useI18n();
defineProps<{
  rows: HrRecord[];
  columns: string[];
  columnLabels?: Record<string, string>;
  formatters?: Record<string, (value: string | number) => string>;
  statusLabels?: Record<string, string>;
  contextMenuItems?: MenuItem[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string;
}>();
defineEmits(['page', 'sort', 'view', 'reset', 'retry']);
const selection = ref<HrRecord[]>([]);
const contextMenu = ref<InstanceType<typeof ContextMenu>>();
const contextSelection = ref<HrRecord>();
const severity = (s: string) =>
  ({
    active: 'success',
    approved: 'success',
    pending: 'warning',
    expired: 'danger',
    terminated: 'secondary',
    rejected: 'danger',
  })[s] || 'info';
</script>
<template>
  <AppErrorState
    v-if="error"
    :error="error"
    @retry="$emit('retry')"
  /><template v-else>
    <ContextMenu
      v-if="contextMenuItems?.length"
      ref="contextMenu"
      :model="contextMenuItems"
      @hide="contextSelection = undefined"
    />
    <DataTable
      v-model:selection="selection"
      v-model:context-menu-selection="contextSelection"
      :context-menu="!!contextMenuItems?.length"
      :value="rows"
      :loading="loading"
      data-key="id"
      lazy
      paginator
      :rows="pageSize"
      :total-records="total"
      :first="(page - 1) * pageSize"
      :rows-per-page-options="[10, 20, 50, 100]"
      scrollable
      removable-sort
      @row-contextmenu="contextMenu?.show($event.originalEvent)"
      @page="$emit('page', $event)"
      @sort="$emit('sort', $event)"
    >
      <Column
        selection-mode="multiple"
        header-style="width:3rem"
      /><Column
        v-for="col in columns"
        :key="col"
        :field="col"
        :header="columnLabels?.[col] ?? t(col)"
        sortable
        :style="{ minWidth: col === 'name' ? '200px' : '115px' }"
      >
        <template #body="{ data }">
          <span v-if="formatters?.[col]">{{ formatters[col](data[col]) }}</span><AppStatusBadge
            v-else-if="col === 'status'"
            :label="
              statusLabels?.[String(data[col])] ??
                (te(String(data[col])) ? t(String(data[col])) : String(data[col] ?? ''))
            "
            :severity="severity(data[col])"
          /><button
            v-else-if="col === 'code'"
            class="table-link"
            @click="$emit('view', data)"
          >
            {{ data[col] }}
          </button><span
            v-else-if="
              [
                'salary',
                'income',
                'amount',
                'serviceCharge',
                'overtimePay',
                'allowance',
                'gross',
                'insurance',
                'tax',
                'deductions',
              ].includes(col)
            "
            class="money"
          >{{ currency(data[col], locale) }}</span><span
            v-else-if="col === 'name'"
            class="person-cell"
          ><span class="avatar">{{
            String(data.name)
              .split(' ')
              .slice(-2)
              .map((v) => v[0])
              .join('')
          }}</span><span>{{ te(String(data[col])) ? t(String(data[col])) : data[col]
          }}<small>{{ data.email }}</small></span></span><span v-else>{{ te(String(data[col])) ? t(String(data[col])) : data[col] }}</span>
        </template>
      </Column><Column
        :header="t('actions')"
        frozen
        align-frozen="right"
        style="min-width: 100px"
      >
        <template #body="{ data }">
          <slot
            name="actions"
            :row="data"
          >
            <button
              class="icon-button"
              :aria-label="t('view')"
              @click="$emit('view', data)"
            >
              <i class="pi pi-arrow-up-right" />
            </button>
          </slot>
        </template>
      </Column><template #empty>
        <AppEmptyState @reset="$emit('reset')" />
      </template>
    </DataTable>
    <div
      v-if="selection.length"
      class="selection-note"
    >
      {{ t('selected') }}: {{ selection.length }}
    </div>
  </template>
</template>
