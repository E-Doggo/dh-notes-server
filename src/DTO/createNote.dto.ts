export interface CreateNoteDTO {
  title: string;
  content: string;
  is_archived: boolean;
  user_id: number;
  tag_ids: number[];
}
