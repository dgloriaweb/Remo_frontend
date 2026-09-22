<script setup>
import { computed, ref, watch } from 'vue'

import categories from '../assets/json/category.json'
import user_groups from '../assets/json/user_group.json'
import statuses from '../assets/json/status.json'

const default_user_group_id = 3 // Members
const default_status_id = 1 // open_for_voting

const form = ref({
  type: 'suggestion',
  title: '',
  description: '',
  category_id: 1,
  user_group_id: default_user_group_id,
  status_id: default_status_id,
  teacher_name: '',
  teacher_instrument: '',
})

const is_teacher_feedback = computed(() => Number(form.value.category_id) === 2)

watch(
  () => form.value.category_id,
  (category_id) => {
    if (Number(category_id) !== 2) {
      form.value.teacher_name = ''
      form.value.teacher_instrument = ''
    }
  },
)

const payload_preview = computed(() => {
  const now = new Date().toISOString()
  return {
    entry_id: 0,
    type: form.value.type,
    title: form.value.title,
    description: form.value.description,
    category_id: Number(form.value.category_id),
    user_group_id: Number(form.value.user_group_id),
    status_id: Number(form.value.status_id),
    author: {
      user_id: 0,
      name: '',
      email: '',
    },
    teacher_name: form.value.teacher_name ?? '',
    teacher_instrument: form.value.teacher_instrument ?? '',
    created_at: now,
  }
})

function on_submit() {
  // Example-only view: for now we just keep a preview.
  // Wire this to your backend later (POST /api/entries or similar).
}
</script>

<template>
  <main class="entry-page">
    <h1>Új visszajelzés</h1>

    <form class="card" @submit.prevent="on_submit">
      <div class="entry-form-grid">
        <section class="entry-col-left">
          <label class="form-field">
            <span>Típus</span>
            <select class="form-select form-control-full" v-model="form.type">
              <option value="bug">bug</option>
              <option value="feature_request">feature_request</option>
              <option value="suggestion">suggestion</option>
              <option value="appreciation">appreciation</option>
            </select>
          </label>

          <label class="form-field">
            <span>Kinek szól?</span>
            <select class="form-select form-control-full" v-model.number="form.category_id">
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
                {{ cat.name }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>Beküldő csoport</span>
            <select class="form-select form-control-full" v-model.number="form.user_group_id">
              <option
                v-for="grp in user_groups"
                :key="grp.user_group_id"
                :value="grp.user_group_id"
              >
                {{ grp.label }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>Státusz</span>
            <select class="form-select form-control-full" v-model.number="form.status_id">
              <option v-for="st in statuses" :key="st.status_id" :value="st.status_id">
                {{ st.label }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>Cím</span>
            <input class="form-input form-control-full" v-model="form.title" />
          </label>

          <div v-if="is_teacher_feedback" class="entry-grid2">
            <label class="form-field">
              <span>Tanár neve</span>
              <input
                class="form-input form-control-full"
                v-model="form.teacher_name"
                placeholder="kézzel kitöltve"
              />
            </label>
            <label class="form-field">
              <span>Hangszer</span>
              <input
                class="form-input form-control-full"
                v-model="form.teacher_instrument"
                placeholder="kézzel kitöltve"
              />
            </label>
          </div>
          <div v-else class="hint">
            Tanár mezők akkor kellenek, ha a címzett: <strong>Oktató</strong>.
          </div>

          <button class="btn" type="submit">Mentés (később)</button>
        </section>

        <section class="entry-col-right">
          <label class="form-field entry-description-field">
            <span>Leírás</span>
            <textarea
              class="form-textarea entry-description-textarea"
              v-model="form.description"
            />
          </label>
        </section>
      </div>
    </form>

    <h2>JSON példa (migrációhoz)</h2>
    <pre class="code-block">{{ JSON.stringify(payload_preview, null, 2) }}</pre>
  </main>
</template>

