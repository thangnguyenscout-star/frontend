<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import AppButton from '@/components/common/AppButton.vue';
import { useAuth } from '@/composables/useAuth';
import { getErrorMessage } from '@/utils/error-message';
const { t, locale } = useI18n();
const busy = ref(false);
const username = ref(''),
  password = ref(''),
  showPassword = ref(false),
  errorCode = ref('');
const error = computed(() =>
  errorCode.value ? getErrorMessage(errorCode.value, locale.value) : '',
);
const auth = useAuth(),
  router = useRouter(),
  route = useRoute();
async function login() {
  if (busy.value) return;
  errorCode.value = '';
  if (!username.value.trim() || !password.value) {
    errorCode.value = 'COMMON_REQUIRED';
    return;
  }
  busy.value = true;
  try {
    const result = await auth.login({ userName: username.value.trim(), password: password.value });
    if (!result.isResults) {
      errorCode.value = result.errors[0]?.code ?? 'COMMON_UNKNOWN_ERROR';
      return;
    }
    await router.push({ name: 'Dashboard' });
  } catch {
    errorCode.value = 'COMMON_UNKNOWN_ERROR';
  } finally {
    password.value = '';
    busy.value = false;
  }
}
</script>
<template>
  <div
    class="login-page"
    style="
      background-image: url('/stitch-login-background.jpg');
      background-size: cover;
      background-position: center;
    "
  >
    <header class="login-topbar">
      <div class="profile-identity">
        <span class="brand-mark"><img
          src="/stitch-logo.png"
          alt="Grand Hotel"
          style="width: 32px; height: 32px; object-fit: contain"
        ></span>
        <div class="brand-name">
          Grand Hotel Saigon<small>{{ t('authentication.login.subtitle') }}</small>
        </div>
      </div>
      <span class="status-badge success"><span class="status-dot" /> {{ t('authentication.login.online') }}</span>
    </header>
    <div class="login-side">
      <form
        class="login-card"
        novalidate
        @submit.prevent="login"
      >
        <div class="eyebrow">
          <i class="pi pi-lock" /> {{ t('authentication.login.portal') }}
        </div>
        <h2>{{ t('authentication.login.title') }}</h2>
        <p>{{ t('authentication.login.description') }}</p>
        <p
          v-if="route.query.expired"
          class="session-alert"
        >
          {{ getErrorMessage('AUTH_TOKEN_EXPIRED', locale) }}
        </p>
        <label
          class="form-field"
          for="username"
        ><span>{{ t('authentication.login.username') }} <b>*</b></span><InputText
          id="username"
          v-model="username"
          :disabled="busy"
          autocomplete="username"
          :placeholder="t('authentication.login.usernamePlaceholder')"
        /></label>
        <label
          class="form-field"
          for="password"
        ><span>{{ t('authentication.login.password') }} <b>*</b></span><span class="password-wrap"><InputText
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :disabled="busy"
          autocomplete="current-password"
          :placeholder="t('authentication.login.passwordPlaceholder')"
        /><button
          class="icon-button"
          type="button"
          :aria-label="
            t(
              showPassword
                ? 'authentication.login.hidePassword'
                : 'authentication.login.showPassword',
            )
          "
          @click="showPassword = !showPassword"
        >
          <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" /></button></span></label>
        <p
          v-if="error"
          role="alert"
          class="field-error"
        >
          {{ error }}
        </p>
        <AppButton
          type="submit"
          :label="t('authentication.login.submit')"
          icon="pi pi-sign-in"
          :loading="busy"
          :disabled="busy"
        />
        <small>{{ t('authentication.login.sessionHint') }}</small>
      </form>
    </div>
    <footer class="login-bottom">
      <span>© {{ new Date().getFullYear() }} Grand Hotel Saigon.
        {{ t('authentication.login.copyright') }}</span><span>Hotel Human Resources Management</span>
    </footer>
  </div>
</template>
