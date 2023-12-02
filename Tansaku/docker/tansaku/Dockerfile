FROM python:3.10.6-slim-bullseye as base


COPY ./ml_requirements.txt /ml_requirements.txt
RUN pip install --no-cache-dir -r ml_requirements.txt

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


FROM python:3.10.6-slim-bullseye as build

RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

COPY --from=base /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

RUN mkdir -p /app
COPY . /app
WORKDIR /app/

CMD ["/usr/bin/supervisord"]
CMD ["python", "app.py"]
ENV PYTHONBUFFERED 1
