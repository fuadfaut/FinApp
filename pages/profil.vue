<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-emerald-600 text-white p-4 rounded-b-2xl shadow-md">
      <h1 class="text-xl font-bold">Profil</h1>
      <p class="text-sm opacity-80">Pengaturan dan informasi pengguna</p>
    </div>

    <div class="container mx-auto px-4 py-6 max-w-md">
      <!-- User Profile Card -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
            <span v-if="!profile.photoUrl" class="text-2xl font-bold text-emerald-600">{{ profileInitials }}</span>
            <img v-else :src="profile.photoUrl" class="w-full h-full rounded-full object-cover" alt="Profile Photo" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ profile.name || 'Pengguna FinApp' }}</h2>
            <p class="text-sm text-gray-500">{{ profile.email || 'Belum ada email' }}</p>
          </div>
        </div>
        <button @click="showEditProfileModal = true" class="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          Edit Profil
        </button>
      </div>

      <!-- App Settings -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Aplikasi</h2>
        
        <div class="space-y-4">
          <!-- Theme Setting -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-700">Tema Aplikasi</h3>
              <p class="text-sm text-gray-500">Pilih tema tampilan</p>
            </div>
            <select v-model="settings.theme" class="rounded-lg border-gray-300 text-gray-700 text-sm focus:ring-emerald-500 focus:border-emerald-500">
              <option value="light">Terang</option>
              <option value="dark">Gelap</option>
              <option value="system">Ikuti Sistem</option>
            </select>
          </div>

          <!-- Currency Setting -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-700">Format Mata Uang</h3>
              <p class="text-sm text-gray-500">Tampilan mata uang</p>
            </div>
            <select v-model="settings.currency" class="rounded-lg border-gray-300 text-gray-700 text-sm focus:ring-emerald-500 focus:border-emerald-500">
              <option value="IDR">Rupiah (Rp)</option>
              <option value="USD">Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <!-- Notification Setting -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-700">Notifikasi</h3>
              <p class="text-sm text-gray-500">Aktifkan pengingat</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <!-- Budget Reminder Setting -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-700">Pengingat Budget</h3>
              <p class="text-sm text-gray-500">Peringatan saat mendekati limit</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.budgetReminders" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Categories Management -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Kategori Transaksi</h2>
          <button @click="showAddCategoryModal = true" class="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        
        <div class="space-y-2">
          <div v-if="store.categories.length === 0" class="text-center py-4 text-gray-500">
            Belum ada kategori. Tambahkan kategori baru.
          </div>
          
          <div v-for="category in store.categories" :key="category.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :style="{ backgroundColor: category.color + '33', color: category.color }">
                <i class="text-sm">{{ category.icon }}</i>
              </div>
              <span class="font-medium">{{ category.name }}</span>
            </div>
            <div class="flex space-x-2">
              <button @click="editCategory(category)" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button @click="deleteCategory(category.id)" class="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- App Info -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Tentang Aplikasi</h2>
        <div class="space-y-2 text-sm text-gray-600">
          <p>FinApp Gokil! v1.0.0</p>
          <p>Aplikasi pengelolaan keuangan pribadi</p>
          <p>Dibuat dengan ❤️ menggunakan Vue.js & Nuxt</p>
        </div>
      </div>

      <!-- Logout Button -->
      <button @click="resetAppData" class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mb-6">
        Reset Data Aplikasi
      </button>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfileModal" class="modal-overlay show">
      <div class="modal-content relative">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Edit Profil</h3>
        
        <div class="space-y-4">
          <div class="flex justify-center mb-4">
            <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center relative">
              <span v-if="!editedProfile.photoUrl" class="text-3xl font-bold text-emerald-600">{{ profileInitials }}</span>
              <img v-else :src="editedProfile.photoUrl" class="w-full h-full rounded-full object-cover" alt="Profile Photo" />
              <button @click="triggerFileInput" class="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-700 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
              </button>
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input v-model="editedProfile.name" type="text" class="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Nama Anda" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="editedProfile.email" type="email" class="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500" placeholder="email@example.com" />
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button @click="saveProfile" class="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Simpan
          </button>
          <button @click="showEditProfileModal = false" class="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Batal
          </button>
        </div>
        
        <button @click="showEditProfileModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showAddCategoryModal" class="modal-overlay show">
      <div class="modal-content relative">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">
          {{ editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input v-model="newCategory.name" type="text" class="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Nama kategori" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
            <input v-model="newCategory.icon" type="text" class="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Emoji atau ikon" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warna</label>
            <input v-model="newCategory.color" type="color" class="w-full h-10 rounded-lg border-gray-300 p-1" />
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button @click="saveCategory" class="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            {{ editingCategoryId ? 'Perbarui' : 'Tambah' }}
          </button>
          <button @click="showAddCategoryModal = false" class="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Batal
          </button>
        </div>
        
        <button @click="showAddCategoryModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- Confirm Reset Modal -->
    <div v-if="showResetConfirmModal" class="modal-overlay show">
      <div class="modal-content relative">
        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Reset Data Aplikasi</h3>
        <p class="text-gray-600 mb-6 text-center">Apakah Anda yakin ingin menghapus semua data aplikasi? Tindakan ini tidak dapat dibatalkan.</p>
        
        <div class="flex gap-3">
          <button @click="confirmReset" class="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Ya, Reset Data
          </button>
          <button @click="showResetConfirmModal = false" class="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Batal
          </button>
        </div>
        
        <button @click="showResetConfirmModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <FooterNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';
import FooterNav from '~/components/FooterNav.vue';
import { v4 as uuidv4 } from 'uuid';

const store = useFinanceStore();

// Profile data
const profile = ref({
  name: '',
  email: '',
  photoUrl: ''
});

// App settings
const settings = ref({
  theme: 'light',
  currency: 'IDR',
  notifications: true,
  budgetReminders: true
});

// Modal states
const showEditProfileModal = ref(false);
const showAddCategoryModal = ref(false);
const showResetConfirmModal = ref(false);

// Edited profile
const editedProfile = ref({
  name: '',
  email: '',
  photoUrl: ''
});

// New category
const newCategory = ref({
  name: '',
  icon: '📊',
  color: '#10B981'
});

// Editing category ID
const editingCategoryId = ref(null);

// File input ref
const fileInput = ref(null);

// Profile initials
const profileInitials = computed(() => {
  if (!profile.value.name) return '?';
  
  const nameParts = profile.value.name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Load profile and settings
onMounted(() => {
  const savedProfile = localStorage.getItem('finapp_profile');
  if (savedProfile) {
    profile.value = JSON.parse(savedProfile);
  }
  
  const savedSettings = localStorage.getItem('finapp_settings');
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings);
  }
});

// Trigger file input
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file change
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    editedProfile.value.photoUrl = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Save profile
const saveProfile = () => {
  profile.value = { ...editedProfile.value };
  localStorage.setItem('finapp_profile', JSON.stringify(profile.value));
  showEditProfileModal.value = false;
};

// Edit profile
const editProfile = () => {
  editedProfile.value = { ...profile.value };
  showEditProfileModal.value = true;
};

// Save category
const saveCategory = () => {
  if (!newCategory.value.name) return;
  
  if (editingCategoryId.value) {
    // Update existing category
    store.updateCategory(editingCategoryId.value, newCategory.value);
  } else {
    // Add new category
    store.addCategory(newCategory.value);
  }
  
  // Reset form
  newCategory.value = {
    name: '',
    icon: '📊',
    color: '#10B981'
  };
  editingCategoryId.value = null;
  showAddCategoryModal.value = false;
};

// Edit category
const editCategory = (category) => {
  editingCategoryId.value = category.id;
  newCategory.value = { ...category };
  showAddCategoryModal.value = true;
};

// Delete category
const deleteCategory = (categoryId) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    const result = store.deleteCategory(categoryId);
    if (!result.success) {
      alert(result.message || 'Gagal menghapus kategori');
    }
  }
};

// Reset app data
const resetAppData = () => {
  showResetConfirmModal.value = true;
};

// Confirm reset
const confirmReset = () => {
  localStorage.removeItem('finapp_data');
  localStorage.removeItem('finapp_profile');
  localStorage.removeItem('finapp_settings');
  
  // Reset store
  store.resetStore();
  
  // Reset profile and settings
  profile.value = {
    name: '',
    email: '',
    photoUrl: ''
  };
  
  settings.value = {
    theme: 'light',
    currency: 'IDR',
    notifications: true,
    budgetReminders: true
  };
  
  showResetConfirmModal.value = false;
  alert('Data aplikasi berhasil direset!');
};

// Watch settings changes
watch(settings, (newSettings) => {
  localStorage.setItem('finapp_settings', JSON.stringify(newSettings));
}, { deep: true });
</script>