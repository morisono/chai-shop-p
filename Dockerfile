FROM rclone/rclone

COPY ./rclone.conf /config/rclone/rclone.conf

# バックアップ目的なので`sync`ではなく`copy`に
CMD ["copy", "r2:バケット名", "gcs:バケット名"]