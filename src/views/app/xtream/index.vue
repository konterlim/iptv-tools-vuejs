<template>
  <erd-row :class="{ 'app-row': isXtreamEditor }">
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-plus"
        @click="doAdd"
        v-if="!editor && !shoutcast && !radioBrowser && !isXtreamEditor"
        variant="success"
        >{{ addButtonText }}</erd-button
      >
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-save"
        @click="doSave"
        v-if="editor"
        variant="primary"
        :disabled="isBusy"
        >{{ $t("general.save") }}</erd-button
      >
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-times"
        @click="doCancel"
        v-if="editor"
        variant="danger"
        :disabled="isBusy"
        >{{ $t("general.cancel") }}</erd-button
      >
      <erd-button
        class="mr-2 py-1 px-2"
        icon="las la-sync"
        @click="doRefresh"
        v-if="!editor && !shoutcast && !radioBrowser && !isXtreamEditor"
        >{{ $t("general.refresh") }}</erd-button
      >
      <span class="text-muted" v-if="!editor && !isXtreamEditor">{{
        $t("general.from-to-total").format(
          this.total > 0 ? this.from + 1 : this.from,
          this.to,
          this.total
        )
      }}</span>
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-save"
        @click="doSave"
        v-if="isXtreamEditor && editorChanges"
        variant="primary"
        :disabled="isBusy"
        >{{ $t("general.save-changes") }}</erd-button
      >
      <erd-button
        class="mr-3 py-1 px-2"
        icon="las la-times"
        @click="doCancel"
        v-if="isXtreamEditor && editorChanges"
        variant="danger"
        :disabled="isBusy"
        >{{ $t("general.cancel") }}</erd-button
      >
      <erd-select
        class="playlist-select"
        v-if="isXtreamEditor"
        :items="editorPlaylists"
        v-model="editorPlaylist"
      ></erd-select>
    </erd-breadcrumb>
    <erd-tab
      :tabs="tabsXtream"
      v-model="activeTab"
      v-if="isXtreamPlaylists && editor"
    ></erd-tab>
    <erd-tab
      :tabs="tabsMovies"
      v-model="activeTab"
      v-if="isXtreamMoviesSeries && editor"
    ></erd-tab>
    <div class="seperator page" v-if="showSeperator"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      tabsXtream: [
        this.$t("tabs.source"),
        this.$t("tabs.xtream-api"),
        this.$t("tabs.sync"),
        this.$t("tabs.security"),
      ],
      tabsMovies: [this.$t("tabs.stream"), this.$t("tabs.tmdb")],
      activeTab: 0,
      from: 0,
      to: 0,
      total: 0,
      editor: false,
      isLoaded: false,
      isBusy: false,
      editorChanges: false,
      editorPlaylists: [],
      editorPlaylist: undefined,
    };
  },
  computed: {
    breadcrumb() {
      let res = [];
      this.$route.matched.map((item) => {
        res.push({
          text: this.$t(`menu.${item.name.toLowerCase()}`),
          to: item.path !== "" ? item.path : "/",
        });
      });
      return res;
    },
    heading() {
      let br = this.breadcrumb;
      return br[br.length - 1].text;
    },
    isXtreamPlaylists() {
      return /\/xtream\/playlists/.test(this.$route.path);
    },
    isXtreamMoviesSeries() {
      return (
        /\/xtream\/movies/.test(this.$route.path) ||
        /\/xtream\/series/.test(this.$route.path)
      );
    },
    isXtreamEditor() {
      return /\/xtream\/editor/.test(this.$route.path);
    },
    showSeperator() {
      if (this.isXtreamPlaylists && this.editor) {
        return false;
      }
      if (this.isXtreamMoviesSeries && this.editor) {
        return false;
      }
      return true;
    },
    addButtonText() {
      // Playlist
      if (/\/xtream\/playlists/.test(this.$route.path)) {
        return this.$t("xtream.add-playlist");
      }
      // Group
      if (/\/xtream\/groups/.test(this.$route.path)) {
        return this.$t("xtream.add-group");
      }
      // Live
      if (/\/xtream\/live/.test(this.$route.path)) {
        return this.$t("xtream.add-live-stream");
      }
      // Movie
      if (/\/xtream\/movies/.test(this.$route.path)) {
        return this.$t("xtream.add-movie");
      }
      // Series
      if (/\/xtream\/series/.test(this.$route.path)) {
        return this.$t("xtream.add-series");
      }
      return "Add";
    },
    shoutcast() {
      return /\/radio\/shoutcast/.test(this.$route.path);
    },
    radioBrowser() {
      return /\/radio\/radiobrowser/.test(this.$route.path);
    },
  },
  methods: {
    ...mapActions(["updateSoundcloudId"]),
    updateFrom(from) {
      this.from = from;
    },
    updateTo(to) {
      this.to = to;
    },
    updateTotal(total) {
      this.total = total;
    },
    updateeditor(editor) {
      if (!editor) {
        this.activeTab = 0;
      }
      this.editor = editor;
    },
    updateIsBusy(busy) {
      this.isBusy = busy;
    },
    updateEditorChanges(val) {
      this.editorChanges = val;
    },
    doRefresh() {
      EventBus.$emit("refresh");
    },
    doSave() {
      EventBus.$emit("save");
    },
    doCancel() {
      EventBus.$emit("cancel");
    },
    doAdd() {
      EventBus.$emit("add");
    },
    loadPlaylists() {
      httpService
        .get("playlist/simple")
        .then((res) => {
          if (res.status === true) {
            this.editorPlaylists = res.data.map((playlist) => {
              return {
                text: playlist.name,
                value: playlist.id,
              };
            });
          }
        })
        .catch(() => {
          this.editorPlaylists = [];
        });
    },
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      this.activeTab = 0;
      this.editorPlaylist = undefined;
      if (this.$route.params.editor !== true) {
        this.editor = false;
      }
    },
    shoutCast: function (genre) {
      EventBus.$emit("shoutcast-genre", genre);
    },
    shoutCastSub: function (genre) {
      if (genre.length) {
        EventBus.$emit("shoutcast-genre", genre);
      }
    },
    radiobrowser: function (country) {
      EventBus.$emit("radiobrowser-country", country);
    },
    activeTab: function (tab) {
      EventBus.$emit("tab-change", tab);
    },
    isXtreamEditor: function (val) {
      if (val) {
        this.loadPlaylists();
      }
    },
    editorPlaylist: function (val) {
      EventBus.$emit("editor-playlist", val);
    },
  },
  beforeMount() {
    this.updateSoundcloudId();
    if (this.isXtreamEditor) {
      this.loadPlaylists();
    }
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
    EventBus.$on("update-editor", this.updateeditor);
    EventBus.$on("update-busy", this.updateIsBusy);
    EventBus.$on("editor-changes", this.updateEditorChanges);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
    EventBus.$off("update-editor", this.updateeditor);
    EventBus.$off("update-busy", this.updateIsBusy);
    EventBus.$off("editor-changes", this.updateEditorChanges);
  },
};
</script>

<style scoped>
.seperator.page {
  margin-left: 15px;
  margin-right: 15px;
  width: calc(100% - 30px);
}
.playlist-select {
  min-width: 200px;
}
</style>