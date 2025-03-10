<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Comment, FloatingCommentsProps } from '../common';

defineProps<FloatingCommentsProps>();

const root = ref<HTMLElement>()

const dialog = ref({
    enabled: false,
    position: { x: 0, y: 0 }
});
const openDialog = (x: number, y: number) => {
    dialog.value.enabled = true
    dialog.value.position = { x, y }
}
const closeDialog = () => {
    dialog.value.enabled = false
}

const dialogRef = ref<HTMLElement>()
const getCollissionFreeXY = (x: number, y: number, el: HTMLElement|null|undefined) => {
    if (root.value && el) {
        const rootRect = root.value.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        if (x + elRect.width > rootRect.width) {
            x = rootRect.width - elRect.width - 12;
        }
        if (y + elRect.height > rootRect.height) {
            y = rootRect.height - elRect.height - 12;
        }
    }
    return { x, y }
}
const dialogXY = computed(() => {
    return getCollissionFreeXY(dialog.value.position.x, dialog.value.position.y, dialogRef.value)
})

const comments = defineModel<Comment[]>('comments', {
    default: []
});

const openComment = (id: string) => {
    openedCommentId.value = id
}
const closeComment = () => {
    openedCommentId.value = null
}

const openedCommentId = ref<string|null>(null)
const openedComment = computed(() => {
    return comments.value.find(comment => comment.id === openedCommentId.value)
})
const openedCommentRef = ref<HTMLElement>()
const openedCommentPosition = computed(() => {
    if (openedComment.value && openedCommentRef.value) {
        const position = openedComment.value.position;
        const { x, y } = getCollissionFreeXY(position.x, position.y, openedCommentRef.value)
        return { left: x + 'px', top: y + 'px' }
    }
    return { left: '0px', top: '0px' }
})

const onRightClick = (e: MouseEvent) => {
    if (root.value) {
        openDialog(
            e.clientX - root.value.getBoundingClientRect().left,
            e.clientY - root.value.getBoundingClientRect().top
        )
    }
}
const clearAnyOpenDialogs = () => {
    closeDialog()
    openedCommentId.value = null
}
</script>
<template>
    <div
        :style="{ width: `${width}px`, height: `${height}px`, position: 'relative', overflow: 'hidden' }"
        @click.prevent="clearAnyOpenDialogs" 
        @click.right.prevent="onRightClick" ref="root">
        <slot />
        <!-- others -->
        <div v-if="dialog.enabled" @click.stop ref="dialogRef" :style="{ left: dialogXY.x + 'px', top: dialogXY.y + 'px', position: 'absolute', zIndex: 10 }">
            <slot name="dialog" :position="dialog.position" :actions="{ closeDialog }" />
        </div>
        <template  v-for="comment in comments" :key="comment.id">
            <div v-if="comment.id !== openedCommentId" @click.stop :style="{ position: 'absolute', left: comment.position.x + 'px', top: comment.position.y + 'px', zIndex: 5 }">
                <slot name="comment" :comment="comment" :actions="{ openComment, openDialog }" />
            </div>
        </template>
        <div
            ref="openedCommentRef"
            v-if="openedComment" 
            :style="{ position: 'absolute', ...openedCommentPosition, zIndex: 9 }" 
            @click.stop="openedCommentId = null">
            <slot name="comment-expanded" :comment="openedComment" :actions="{ openDialog, closeComment }" />
        </div>
    </div>
</template>