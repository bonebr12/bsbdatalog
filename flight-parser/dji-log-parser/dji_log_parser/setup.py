from setuptools import setup, find_packages

setup(
    name="dji_log_parser",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "numpy",
        "pandas",
        "pycryptodome",
        "pyproj",
        "pytz"
    ],
)
pip install -e ./dji-log-parser
