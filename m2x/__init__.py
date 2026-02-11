import os


def get_exec_file_dir(file):
        exec_file_path = os.path.abspath(file)

        exec_file_dir = os.path.dirname(exec_file_path)
        return exec_file_dir