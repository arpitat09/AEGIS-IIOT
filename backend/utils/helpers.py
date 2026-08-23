import os


def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)


def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
