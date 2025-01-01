<template>
  <v-container fluid class="pt-2 scrollable-container">
    <v-row dense>
      <v-col cols="12" md="6">

        <v-card class="max-auto rounded-xl" color="#f5f3ef" variant="flat" title="By Category">
          <v-skeleton-loader :loading="loadingChart" class="mx-auto border" type="image, article,image">
            <v-card-text>
              <PieChart :chartData="pieChartData" />
            </v-card-text>
          </v-skeleton-loader>
        </v-card>

      </v-col>
      <v-col cols="12" md="6">
        <v-card class="max-auto rounded-xl" color="#f5f3ef" variant="flat" title="Last week expenses">

          <v-skeleton-loader :loading="loadingChart" type="image, article, image">
            <v-card-text>
              <BarChart :categories="barChartDay" :seriesData="barChartAmount" />
            </v-card-text>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="6">

        <v-card class="max-auto rounded-xl" color="#f5f3ef" variant="flat" title="By Category">
          <v-skeleton-loader :loading="loadingChart" class="mx-auto border" type="image, article,image">
            <v-card-text>
              <PieChart :chartData="pieChartData" />
            </v-card-text>
          </v-skeleton-loader>
        </v-card>

      </v-col>
      <v-col cols="12" md="6">
        <v-card class="max-auto rounded-xl" color="#f5f3ef" variant="flat" title="Last week expenses">

          <v-skeleton-loader :loading="loadingChart" type="image, article, image">
            <v-card-text>
              <BarChart :categories="barChartDay" :seriesData="barChartAmount" />
            </v-card-text>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import PieChart from './PieChart.vue';
import BarChart from './BarChart.vue';
import axiosInstance from '../plugins/axios';
import { getCurrentUser } from '../services/authService';
// import config from '../resources/config';
// const baseURL = config.nodeServerURL;
interface Expense {
  title?: {
    value: string;
    emoji: string;
  };
  amount?: {
    value: string;
    emoji: string;
  };
  date?: {
    value: string;
    emoji: string;
  };
  tags?: {
    value: {
      name: string;
      emoji: string;
    }[];
  };
  category?: {
    value: string;
    emoji: string;
  };
}
const loadingChart = ref(true);
const pieChartData = ref<{ value: number; name: string }[]>([]);
const barChartDay = ref<string[]>([]);
const barChartAmount = ref<number[]>([]);
const currentUser = ref();
const getAllExpenses = async () => {
  barChartDay.value = getLastWeekLabels();
  await axiosInstance.get(`/api/get-expense`)
  .then(result =>{
    const expenses: Expense[] = result.data;
    barChartAmount.value = filterLastWeekSum(expenses);
    pieChartData.value = expenses.map((item) => ({
    value: item.amount && item.amount.value ? parseFloat(item.amount.value) : 0,
    name: item.category && item.category.value ? item.category.value : 'Unknown',
  }));
  loadingChart.value = false;
  }).catch(error =>{
    console.log("getAllExpenses error :",error);
    loadingChart.value = false;
  })
 
}
const getLastWeekLabels = () => {
  const days = [];
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', options));
  }

  return days;
};
const filterLastWeekSum = (expenses: Expense[]) => {
  const last7Days = getLastWeekLabels();
  const result = last7Days.map(day => {
    let sum = 0;
    expenses.forEach(expense => {
      if (expense.date && expense.amount !== undefined) {
        const itemDate = parseDate(expense.date.value);
        if (!itemDate) return;
        const expenseDay = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (expenseDay === day) {
          const amount = parseInt(expense.amount.value, 10);
          if (!isNaN(amount)) {
            sum += amount;
          }
        }
      }

    });
    return sum;
  });

  return result;
}

const parseDate = (date: string) => {
  if (/\d{2}-[A-Za-z]{3}-\d{2}/.test(date)) {
    return new Date(date.replace(/-/g, " "));
  }

  // Handle "13/03/24 15:21" format
  if (/\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}/.test(date)) {
    const [datePart, timePart] = date.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    return new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`); // Convert to ISO format
  }

  // Handle "12/12/2024" format
  if (/\d{2}\/\d{2}\/\d{4}/.test(date)) {
    const [day, month, year] = date.split("/");
    return new Date(`${year}-${month}-${day}T00:00:00`); // Convert to ISO format with default time
  }

  return null;
};

onMounted(async () => {

  currentUser.value = await getCurrentUser();
  getAllExpenses();

});
</script>
<style scoped>
.full-height {
  height: 100%;
}

.scrollable-container {
  height: calc(100vh - 30px);
  overflow-y: auto;
}

.bg-color {
  background-color: rgb(245, 243, 239) !important;
  color: rgb(0, 0, 0) !important;
  caret-color: rgb(0, 0, 0) !important;
}
</style>