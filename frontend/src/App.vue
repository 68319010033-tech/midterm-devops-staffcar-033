<template>
  <div class="app-container">
    <header>
      <h1>ระบบบันทึกข้อมูลรถของบุคลากร (Staff Car System - Vue 3)</h1>
    </header>

    <div class="main-content">
      <div class="form-section">
        <h3>{{ isEditMode ? 'แก้ไขข้อมูลรถ' : 'ลงทะเบียนรถใหม่' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>ทะเบียนรถ:</label>
            <input type="text" v-model="carForm.plate_no" :disabled="isEditMode" required placeholder="เช่น กข 1234 เลย">
          </div>
          <div class="form-group">
            <label>ประเภทรถ:</label>
            <select v-model="carForm.type" required>
              <option value="รถยนต์">รถยนต์</option>
              <option value="รถจักรยานยนต์">รถจักรยานยนต์</option>
            </select>
          </div>
          <div class="form-group">
            <label>ยี่ห้อ / รุ่น:</label>
            <input type="text" v-model="carForm.brand_model" required placeholder="เช่น Toyota Camry">
          </div>
          <div class="form-group">
            <label>สีรถ:</label>
            <input type="text" v-model="carForm.color" required placeholder="เช่น ดำ">
          </div>
          <div class="form-group">
            <label>ชื่อเจ้าของ:</label>
            <input type="text" v-model="carForm.owner" required placeholder="เช่น นายสมชาย ดีใจ">
          </div>
          <div class="form-group">
            <label>แผนกวิชา:</label>
            <input type="text" v-model="carForm.department" required placeholder="เช่น คอมพิวเตอร์ธุรกิจ">
          </div>
          <div class="form-group">
            <label>สถานะสติกเกอร์:</label>
            <select v-model="carForm.status">
              <option value="รอออก">รอออก</option>
              <option value="ออกแล้ว">ออกแล้ว</option>
              <option value="หมดอายุ">หมดอายุ</option>
            </select>
          </div>
          <button type="submit" :class="{ 'update-btn': isEditMode }">
            {{ isEditMode ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล' }}
          </button>
          <button type="button" v-if="isEditMode" @click="resetForm" class="cancel-btn">ยกเลิก</button>
        </form>
      </div>

      <div class="list-section">
        <h3>รายการทะเบียนรถทั้งหมด</h3>
        <table>
          <thead>
            <tr>
              <th>ทะเบียน</th>
              <th>ประเภท</th>
              <th>ยี่ห้อ/รุ่น</th>
              <th>สี</th>
              <th>เจ้าของ (แผนก)</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in cars" :key="car.plate_no">
              <td>{{ car.plate_no }}</td>
              <td>{{ car.type }}</td>
              <td>{{ car.brand_model }}</td>
              <td>{{ car.color }}</td>
              <td>{{ car.owner }} ({{ car.department }})</td>
              <td>
                <span :style="{ color: car.status === 'ออกแล้ว' ? 'green' : car.status === 'หมดอายุ' ? 'red' : 'orange', fontWeight: 'bold' }">
                  {{ car.status }}
                </span>
              </td>
              <td>
                <button @click="editCar(car)" class="edit-btn">แก้ไข</button>
                <button @click="deleteCar(car.plate_no)" class="delete-btn">ลบ</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <footer>
      <p>จัดทำโดย: <strong>[ชื่อของคุณ] [นามสกุลของคุณ]</strong> | รหัสนักศึกษา: <strong>[รหัสของคุณ]</strong></p>
      <p>วิชา DevOps 30901-2008 วิทยาลัยเทคนิคเลย</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000/api/cars';
const cars = ref([]);
const isEditMode = ref(false);

const carForm = ref({
  plate_no: '',
  type: 'รถยนต์',
  brand_model: '',
  color: '',
  owner: '',
  department: '',
  status: 'รอออก'
});

const fetchCars = async () => {
  try {
    const res = await fetch(API_URL);
    cars.value = await res.json();
  } catch (err) {
    console.error('Error fetching cars:', err);
  }
};

const handleSubmit = async () => {
  try {
    const url = isEditMode.value ? `${API_URL}/${carForm.value.plate_no}` : API_URL;
    const method = isEditMode.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carForm.value)
    });

    if (res.ok) {
      resetForm();
      fetchCars();
    } else {
      alert('Error processing request');
    }
  } catch (err) {
    console.error(err);
  }
};

const editCar = (car) => {
  carForm.value = { ...car };
  isEditMode.value = true;
};

const deleteCar = async (plate_no) => {
  if (!confirm(`คุณต้องการลบข้อมูลรถทะเบียน ${plate_no} ใช่หรือไม่?`)) return;
  try {
    const res = await fetch(`${API_URL}/${plate_no}`, { method: 'DELETE' });
    if (res.ok) fetchCars();
  } catch (err) {
    console.error(err);
  }
};

const resetForm = () => {
  carForm.value = { plate_no: '', type: 'รถยนต์', brand_model: '', color: '', owner: '', department: '', status: 'รอออก' };
  isEditMode.value = false;
};

onMounted(fetchCars);
</script>

<style scoped>
.app-container { font-family: Arial, sans-serif; margin: 20px; color: #333; }
header { background-color: #2c3e50; color: white; padding: 15px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
.main-content { display: flex; gap: 20px; }
.form-section { flex: 1; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.list-section { flex: 2; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input, .form-group select { width: 100%; padding: 8px; box-sizing: border-box; }
button { background-color: #27ae60; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 3px; margin-right: 5px; }
button.update-btn { background-color: #3498db; }
button.cancel-btn { background-color: #7f8c8d; }
button.edit-btn { background-color: #3498db; }
button.delete-btn { background-color: #c0392b; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f2f2f2; }
footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #7f8c8d; border-top: 1px solid #ddd; padding-top: 10px; }
</style>