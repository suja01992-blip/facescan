package com.attendancesystem.backend.config;

import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.dialect.identity.IdentityColumnSupportImpl;
import org.hibernate.dialect.pagination.LimitHandler;
import org.hibernate.dialect.pagination.OffsetFetchLimitHandler;
import org.hibernate.dialect.unique.CreateTableUniqueDelegate;
import org.hibernate.dialect.unique.UniqueDelegate;
import org.hibernate.engine.spi.SessionFactoryImplementor;

import java.sql.Types;

public class SQLiteDialect extends Dialect {

    public SQLiteDialect() {
        super();
        
        // Register column types
        registerColumnType(Types.BIT, "integer");
        registerColumnType(Types.TINYINT, "integer");
        registerColumnType(Types.SMALLINT, "integer");
        registerColumnType(Types.INTEGER, "integer");
        registerColumnType(Types.BIGINT, "integer");
        registerColumnType(Types.FLOAT, "real");
        registerColumnType(Types.REAL, "real");
        registerColumnType(Types.DOUBLE, "real");
        registerColumnType(Types.NUMERIC, "numeric");
        registerColumnType(Types.DECIMAL, "numeric");
        registerColumnType(Types.CHAR, "text");
        registerColumnType(Types.VARCHAR, "text");
        registerColumnType(Types.LONGVARCHAR, "text");
        registerColumnType(Types.DATE, "text");
        registerColumnType(Types.TIME, "text");
        registerColumnType(Types.TIMESTAMP, "text");
        registerColumnType(Types.BINARY, "blob");
        registerColumnType(Types.VARBINARY, "blob");
        registerColumnType(Types.LONGVARBINARY, "blob");
        registerColumnType(Types.CLOB, "text");
        registerColumnType(Types.BLOB, "blob");
        registerColumnType(Types.BOOLEAN, "integer");
    }

    @Override
    public IdentityColumnSupport getIdentityColumnSupport() {
        return new IdentityColumnSupportImpl() {
            @Override
            public boolean supportsIdentityColumns() {
                return true;
            }

            @Override
            public String getIdentitySelectString(String table, String column, int type) {
                return "select last_insert_rowid()";
            }

            @Override
            public String getIdentityColumnString(int type) {
                return "integer primary key autoincrement";
            }
        };
    }

    @Override
    public boolean hasAlterTable() {
        return false;
    }

    @Override
    public boolean dropConstraints() {
        return false;
    }

    @Override
    public String getDropForeignKeyString() {
        return "";
    }

    @Override
    public String getAddForeignKeyConstraintString(String constraintName,
                                                   String[] foreignKey, String referencedTable,
                                                   String[] primaryKey, boolean referencesPrimaryKey) {
        return "";
    }

    @Override
    public String getAddPrimaryKeyConstraintString(String constraintName) {
        return "";
    }

    @Override
    public boolean supportsLimit() {
        return true;
    }

    @Override
    public LimitHandler getLimitHandler() {
        return OffsetFetchLimitHandler.INSTANCE;
    }

    @Override
    public String getLimitString(String query, boolean hasOffset) {
        return query + (hasOffset ? " limit ? offset ?" : " limit ?");
    }

    @Override
    public boolean supportsTemporaryTables() {
        return true;
    }

    @Override
    public String getCreateTemporaryTableString() {
        return "create temporary table if not exists";
    }

    @Override
    public boolean supportsCurrentTimestampSelection() {
        return true;
    }

    @Override
    public boolean isCurrentTimestampSelectStringCallable() {
        return false;
    }

    @Override
    public String getCurrentTimestampSelectString() {
        return "select current_timestamp";
    }

    @Override
    public UniqueDelegate getUniqueDelegate() {
        return new CreateTableUniqueDelegate(this);
    }

    @Override
    public boolean supportsUnionAll() {
        return true;
    }

    @Override
    public boolean hasDataTypeInIdentityColumn() {
        return false;
    }

    @Override
    public boolean supportsCommentOn() {
        return false;
    }

    @Override
    public boolean supportsIfExistsBeforeTableName() {
        return true;
    }

    @Override
    public String getForUpdateString(String aliases) {
        return "";
    }

    @Override
    public boolean supportsOuterJoinForUpdate() {
        return false;
    }

    @Override
    public String getDropTableString(String tableName) {
        return "drop table if exists " + tableName;
    }

    @Override
    public boolean supportsRowValueConstructorSyntax() {
        return false;
    }
}