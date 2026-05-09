<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-lg font-semibold mb-4">{{ question.text }}</h2>
    <div v-for="(option, idx) in question.options" :key="idx" class="mb-2">
      <label class="flex items-center space-x-2">
        <input
          :type="question.type === 'multiple' ? 'checkbox' : 'radio'"
          :name="'question'"
          :value="option.value"
          :checked="isSelected(option.value)"
          @change="onSelect(option.value, $event.target.checked)"
          class="form-checkbox"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: Object,
  answer: [String, Array]
})
const emit = defineEmits(['update:answer'])

function isSelected(value) {
  if (props.question.type === 'multiple') {
    return Array.isArray(props.answer) && props.answer.includes(value)
  }
  return props.answer === value
}

function onSelect(value, checked) {
  if (props.question.type === 'multiple') {
    let newAnswer = Array.isArray(props.answer) ? [...props.answer] : []
    if (checked) newAnswer.push(value)
    else newAnswer = newAnswer.filter(v => v !== value)
    emit('update:answer', newAnswer)
  } else {
    emit('update:answer', value)
  }
}
</script>