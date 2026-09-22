<script setup>
import { computed, ref } from "vue";

import entries from "../assets/json/entry.json";
import discussions from "../assets/json/discussion.json";
import votes from "../assets/json/vote.json";
import categories from "../assets/json/category.json";
import statuses from "../assets/json/status.json";
import user_groups from "../assets/json/user_group.json";
import users from "../assets/json/user.json";

const sort_value = ref("top-votes");
const target_category = ref("all");
const target_status = ref("all");

const status_by_id = computed(() => {
  const map = new Map();
  for (const item of statuses) map.set(Number(item.status_id), item);
  return map;
});

const user_group_by_id = computed(() => {
  const map = new Map();
  for (const item of user_groups) map.set(Number(item.user_group_id), item);
  return map;
});

const user_by_id = computed(() => {
  const map = new Map();
  for (const item of users) map.set(Number(item.user_id ?? item.id), item);
  return map;
});

const category_by_id = computed(() => {
  const map = new Map();
  for (const item of categories) map.set(Number(item.category_id), item);
  return map;
});

const comments_count_by_entry_id = computed(() => {
  const map = new Map();
  for (const item of discussions) {
    const entry_id = Number(item.entry_id);
    map.set(entry_id, (map.get(entry_id) ?? 0) + 1);
  }
  return map;
});

const votes_count_by_entry_id = computed(() => {
  const map = new Map();
  const seen = new Set();
  for (const item of votes) {
    const entry_id = Number(item.entry_id);
    const user_id = Number(item.user_id);
    const key = `${entry_id}:${user_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    map.set(entry_id, (map.get(entry_id) ?? 0) + 1);
  }
  return map;
});

const ideas = computed(() => {
  return entries.map((entry) => {
    const entry_id = Number(entry.entry_id);
    const user = user_by_id.value.get(Number(entry.user_id));
    const user_group_id = Number(entry.user_group_id);
    const user_group = user_group_by_id.value.get(user_group_id);
    const category_id = Number(entry.category_id);
    const category = category_by_id.value.get(category_id);
    const status = status_by_id.value.get(Number(entry.status_id));

    return {
      entry_id,
      title: entry.title,
      user_id: Number(entry.user_id),
      user_name: user?.name ?? "—",
      user_email: user?.email ?? "",
      user_group_id,
      user_group_label: user_group?.label ?? String(user_group_id),
      category_id,
      category_label: category?.name ?? String(category_id),
      votes: votes_count_by_entry_id.value.get(entry_id) ?? 0,
      status_id: Number(entry.status_id),
      status_label: status?.label ?? "—",
      comments_count: comments_count_by_entry_id.value.get(entry_id) ?? 0,
      created_at: entry.created_at,
    };
  });
});

const filtered_ideas = computed(() => {
  const category_id = target_category.value === "all" ? null : Number(target_category.value);
  const status_id = target_status.value === "all" ? null : Number(target_status.value);

  return ideas.value.filter((idea) => {
    if (category_id !== null && idea.category_id !== category_id) return false;
    if (status_id !== null && Number(idea.status_id) !== status_id) return false;
    return true;
  });
});

const sorted_ideas = computed(() => {
  const items = [...filtered_ideas.value];
  const sort = sort_value.value;

  items.sort((a, b) => {
    const votes_a = Number(a.votes);
    const votes_b = Number(b.votes);
    const date_a = new Date(a.created_at).getTime();
    const date_b = new Date(b.created_at).getTime();

    switch (sort) {
      case "top-votes":
        return votes_b - votes_a;
      case "lowest-votes":
        return votes_a - votes_b;
      case "newest":
        return date_b - date_a;
      case "oldest":
        return date_a - date_b;
      default:
        return 0;
    }
  });

  return items;
});
</script>

<template>
  <main class="home-page">
    <header class="home-header">
      <h1>Zenelek Pulzus</h1>
      <nav class="home-nav">
        <router-link class="home-nav-link" to="/add_entry"
          >Új visszajelzés</router-link
        >
      </nav>
    </header>

    <section class="home-content">
      <h2>Ötletek és javaslatok</h2>

      <div class="home-controls">
        <label class="form-field">
          <span>Rendezés:</span>
          <select class="form-select form-control-full" v-model="sort_value">
            <option value="top-votes">Legtöbb szavazat</option>
            <option value="lowest-votes">Legkevesebb szavazat</option>
            <option value="newest">Legújabb elöl</option>
            <option value="oldest">Legrégebbi elöl</option>
          </select>
        </label>

        <label class="form-field">
          <span>Címzett:</span>
          <select class="form-select form-control-full" v-model="target_category">
            <option value="all">Mind</option>
            <option
              v-for="cat in categories"
              :key="cat.category_id"
              :value="String(cat.category_id)"
            >
              {{ cat.name }}
            </option>
          </select>
        </label>

        <label class="form-field">
          <span>Státusz:</span>
          <select class="form-select form-control-full" v-model="target_status">
            <option value="all">Mind</option>
            <option
              v-for="st in statuses"
              :key="st.status_id"
              :value="String(st.status_id)"
            >
              {{ st.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="home-card-grid">
        <article
          v-for="idea in sorted_ideas"
          :key="idea.entry_id"
          class="home-card"
        >
          <h3>{{ idea.title }}</h3>
          <p>
            <p><strong>Beküldte: {{ idea.user_name }} </strong><span><small>({{ idea.user_group_label }})</small></span></p>
          </p>
          <p><strong>Címzett:</strong> {{ idea.category_label }}</p>
          <p><strong>Szavazatok száma:</strong> {{ idea.votes }}</p>
          <p><strong>Státusz:</strong> {{ idea.status_label }}</p>
          <p>
            <small>💬 {{ idea.comments_count }} hozzászólás</small>
          </p>
        </article>
      </div>

      <div class="home-pagination">
        <button class="btn" disabled>Vissza</button>
        <button class="btn" disabled>Tovább</button>
      </div>
    </section>
  </main>
</template>
