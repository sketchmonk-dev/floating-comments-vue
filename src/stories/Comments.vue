<script setup lang="ts">
import { ref } from "vue";
import { type FloatingCommentsProps, type Comment } from "../../lib/common";
import { FloatingComments } from "../../lib";

const props = defineProps<FloatingCommentsProps>();

const comments = defineModel<
  Comment<{
    user: {
      username: string;
      profileUrl: string;
    };
    content: string;
    timestamp: string;
  }>[]
>("comments", {
  default: [],
});

const content = ref<string>("");
const addComment = (position: { x: number; y: number }) => {
  comments.value = [
    ...comments.value,
    {
      id: Math.random().toString(36).substring(7),
      data: {
        user: {
          username: "User",
          profileUrl: "https://avatars.githubusercontent.com/u/1?v=4",
        },
        content: content.value,
        timestamp: new Date().toISOString(),
      },
      position,
    },
  ];
};
</script>
<template>
  <FloatingComments v-bind="props" v-model:comments="comments">
    <template #default>
      <div class="w-full h-full bg-background"></div>
    </template>
    <template #dialog="{ actions, position }">
      <div class="dialog">
        <div class="dialog__title">Add Comment</div>
        <div class="dialog__content">
          <textarea
            @keyup.enter="
              addComment(position);
              actions.closeDialog();
            "
            v-model="content"
            class="dialog__textarea"
          ></textarea>
        </div>
      </div>
    </template>
    <template #comment="{ comment, actions }">
      <div @click="actions.openComment(comment.id)" class="comment">
        <div class="comment__avatar">
          {{ comment.data.user.username.charAt(0) }}
        </div>
      </div>
    </template>
    <template #comment-expanded="{ comment }">
      <div class="dialog">
        <div class="dialog__title">{{ comment.data.user.username }}</div>
        <div class="dialog__content">
          <div class="dialog__description">{{ comment.data.content }}</div>
        </div>
      </div>
    </template>
  </FloatingComments>
</template>
<style lang="css">
* {
  font-family: monospace;
}

:root {
  --background: #defaultd4a373;
  --surface: #fefae0;
}

.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.bg-surface {
  background-color: var(--surface);
}
.box {
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
}
.m-4 {
  margin: 1rem;
}

.dialog {
  background-color: var(--surface);
  border: 3px solid #000;
  border-radius: 4px;
  width: 200px;
  box-sizing: border-box;
  box-shadow: 4px 4px 0 #000;
}

.dialog__title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
  padding: 0.5rem 1rem;
  border-bottom: 3px solid #000;
  text-align: center;
}

.dialog__content {
  padding: 1rem;
  box-sizing: border-box;
}

.dialog__textarea {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  box-sizing: border-box;
  font-size: 1rem;
  border: 3px solid #000;
  border-radius: 4px;
}

.dialog__description {
  font-size: 0.875rem;
  opacity: 0.75;
}

.comment {
  width: 40px;
  height: 40px;
  background-color: var(--surface);
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  border-radius: 50rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.comment::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  background-color: var(--surface);
  top: -2px;
  left: -2px;
  z-index: 1;
}

.comment__avatar {
  width: 28px;
  height: 28px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #000;
  color: var(--surface);
  border-radius: 50rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
</style>
