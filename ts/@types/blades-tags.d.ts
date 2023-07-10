
type BladesTag = Vice
| Playbook
| District
| Tag.System
| Tag.Item
| Tag.NPC
| Tag.PC;

interface TagifyState {
  state: {
    inputText: boolean,
    editing: boolean
  }
}

declare class Tagify {
  dropdown: Record<string, any>
}